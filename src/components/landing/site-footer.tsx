import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="border-t bg-background px-4 py-6 text-sm text-muted-foreground">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                <p>© 2025 DreamLayer. All rights reserved.</p>
                <div className="flex space-x-4">
                    <Link href="/privacy" className="hover:underline">Privacy</Link>
                    <Link href="/terms" className="hover:underline">Terms</Link>
                    <Link href="/docs" className="hover:underline">Docs</Link>
                </div>
            </div>
        </footer>
    );
}
