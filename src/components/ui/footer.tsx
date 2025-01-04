import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Made with <Heart className="inline-block h-4 w-4 text-red-500" /> by{" "}
          <a
            href="https://memexchange.io"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            MemExchange team
          </a>
        </p>
      </div>
    </footer>
  );
}
