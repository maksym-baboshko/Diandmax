import createNextIntlPlugin from "next-intl/plugin";
import baseConfig from "./configs/next/config";

const withNextIntl = createNextIntlPlugin("./src/shared/i18n/request.ts");

export default withNextIntl(baseConfig);
