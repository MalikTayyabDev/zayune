import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-content py-28 text-center">
      <p className="text-nav text-aubergine/45">404</p>
      <h1 className="mt-3 font-display text-4xl text-aubergine">Page not found</h1>
      <p className="mt-4 text-sm text-aubergine/60">
        This path doesn’t lead to a piece in the studio.
      </p>
      <Button href="/" className="mt-8">
        Return home
      </Button>
    </div>
  );
}
