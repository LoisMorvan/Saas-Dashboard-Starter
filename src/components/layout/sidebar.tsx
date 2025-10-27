import ClientSideNav from "./sidebar.client";

export default async function Sidebar() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || "0.0.0";
  return <ClientSideNav version={version} />;
}
