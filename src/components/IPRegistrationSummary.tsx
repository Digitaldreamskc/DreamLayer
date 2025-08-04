import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface IPRegistrationSummaryProps {
  title: string;
  description: string;
  license: string;
  ipfsUrl: string;
  imageUrl?: string;
}

export function IPRegistrationSummary({
  title,
  description,
  license,
  ipfsUrl,
  imageUrl,
}: IPRegistrationSummaryProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Registration Summary</span>
          <Badge variant="outline" className="capitalize">
            {license}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {imageUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <img
                src={imageUrl}
                alt={title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ExternalLink className="w-4 h-4" />
            <a
              href={ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View on IPFS
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 