import { redirect } from "next/navigation";
import PasswordProtected from "@/components/PasswordProtected";
import { urlStore } from "@/app/data";
import { log } from "console";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ shortId: string }>; 
}) {
  const unwrappedParams = await params; 
  const { shortId } = unwrappedParams;
  const url = urlStore[shortId];
  log(urlStore);
  if (!url) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">404 - URL not found</h1>
          <p>The requested URL does not exist.</p>
        </div>
      </div>
    );
  }

  if (url.password) {
    return <PasswordProtected shortId={shortId} />;
  }

  redirect(url.originalUrl);
}
