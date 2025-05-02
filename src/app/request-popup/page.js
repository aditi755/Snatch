// //app/request-popup/page.js
import dynamic from "next/dynamic";

const RequestPopupWrapper = dynamic(() => import("@/components/RequestPopupWrapper"), {
  ssr: false,
});

export default function Page() {
  return <RequestPopupWrapper />;
}
