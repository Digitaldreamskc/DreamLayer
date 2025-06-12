export interface ImageConfig {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    allowedTypes: string[];
}

export interface ProcessedImage {
    url: string;
    width: number;
    height: number;
    size: number;
    type: string;
}

export class ImageValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ImageValidationError';
    }
}

export const DEFAULT_IMAGE_CONFIG: ImageConfig = {
    maxSizeMB: 10,
    maxWidthOrHeight: 2048,
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
};

export async function processImage(
    file: File,
    config: ImageConfig = DEFAULT_IMAGE_CONFIG
): Promise<ProcessedImage> {
    // Validate file type
    if (!config.allowedTypes.includes(file.type)) {
        throw new ImageValidationError(
            `Invalid file type. Allowed types: ${config.allowedTypes.join(', ')}`
        );
    }

    // Validate file size
    if (file.size > config.maxSizeMB * 1024 * 1024) {
        throw new ImageValidationError(
            `File size exceeds ${config.maxSizeMB}MB limit`
        );
    }

    // Create an image element to get dimensions
    const img = new Image();
    const imageUrl = URL.createObjectURL(file);
    
    try {
        // Wait for image to load
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = imageUrl;
        });

        // Check dimensions
        if (img.width > config.maxWidthOrHeight || img.height > config.maxWidthOrHeight) {
            throw new ImageValidationError(
                `Image dimensions exceed ${config.maxWidthOrHeight}x${config.maxWidthOrHeight} limit`
            );
        }

        // Return processed image details
        return {
            url: imageUrl,
            width: img.width,
            height: img.height,
            size: file.size,
            type: file.type
        };
    } catch (error) {
        URL.revokeObjectURL(imageUrl);
        if (error instanceof ImageValidationError) {
            throw error;
        }
        throw new ImageValidationError('Failed to process image');
    }
}