import BrandLogoClient from "./brand-logo.client";

type Props = React.ComponentProps<typeof BrandLogoClient>;

export default function BrandLogo(props: Props) {
  return <BrandLogoClient {...props} />;
}
