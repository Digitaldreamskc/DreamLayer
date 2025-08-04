import imageCompression from 'browser-image-compression';

export interface ImageValidationConfig {
    maxSizeInMB: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
    allowedFormats: string[];
}

export const DEFAULT_IMAGE_CONFIG: ImageValidationConfig = {
    maxSizeInMB: 5,
    minWidth: 400,
    minHeight: 400,
    maxWidth: 3000,
    maxHeight: 3000,
    allowedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

export interface ProcessedImage {
    file: File;
    preview: string;
    width: number;
    height: number;
    format: string;
    size: number;
}

export class ImageValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ImageValidationError';
    }
}

export const validateImage = async (
    file: File,
    config: ImageValidationConfig = DEFAULT_IMAGE_CONFIG
): Promise<void> => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > config.maxSizeInMB) {
        throw new ImageValidationError(`File size must be less than ${config.maxSizeInMB}MB`);
    }

    // Check file format
    if (!config.allowedFormats.includes(file.type)) {
        throw new ImageValidationError(
            `Invalid file format. Allowed formats: ${config.allowedFormats
                .map(format => format.split('/')[1])
                .join(', ')}`
        );
    }

    // Check dimensions
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(img.src);
            if (img.width < config.minWidth || img.height < config.minHeight) {
                reject(new ImageValidationError(
                    `Image dimensions must be at least ${config.minWidth}x${config.minHeight}px`
                ));
            }
            if (img.width > config.maxWidth || img.height > config.maxHeight) {
                reject(new ImageValidationError(
                    `Image dimensions must not exceed ${config.maxWidth}x${config.maxHeight}px`
                ));
            }
            resolve();
        };

        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new ImageValidationError('Failed to load image'));
        };
    });
};

export const processImage = async (
    file: File,
    config: ImageValidationConfig = DEFAULT_IMAGE_CONFIG
): Promise<ProcessedImage> => {
    // Validate image first
    await validateImage(file, config);

    // Compression options
    const compressionOptions = {
        maxSizeMB: config.maxSizeInMB,
        maxWidthOrHeight: Math.min(config.maxWidth, config.maxHeight),
        useWebWorker: true,
        preserveExif: true,
    };

    // Compress image if needed
    const compressedFile = await imageCompression(file, compressionOptions);

    // Create preview
    const preview = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to create preview'));
        reader.readAsDataURL(compressedFile);
    });

    // Get dimensions
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.src = preview;
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = () => reject(new Error('Failed to get image dimensions'));
    });

    return {
        file: compressedFile,
        preview,
        width: dimensions.width,
        height: dimensions.height,
        format: compressedFile.type,
        size: compressedFile.size,
    };
};

export const generateThumbnail = async (
    file: File,
    maxSize: number = 300
): Promise<string> => {
    const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: maxSize,
        useWebWorker: true,
    };

    const compressedFile = await imageCompression(file, options);
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to generate thumbnail'));
        reader.readAsDataURL(compressedFile);
    });
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve({ width: img.width, height: img.height });
        };
        img.onerror = () => {
            URL.revokeObjectURL(img.src);
            reject(new Error('Failed to load image'));
        };
    });
};