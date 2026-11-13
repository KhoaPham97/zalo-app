export function getBasePath() {
  const urlParams = new URLSearchParams(window.location.search);
  const appEnv = urlParams.get("env");

  // A normal Render/static web preview does not inject APP_ID. In that
  // environment the app must be mounted at "/". Inside Zalo, APP_ID is
  // provided by the Mini App runtime and the /zapps/<APP_ID> base is used.
  if (window.APP_ID) {
    return `/zapps/${window.APP_ID}`;
  }

  if (
    appEnv === "TESTING_LOCAL" ||
    appEnv === "TESTING" ||
    appEnv === "DEVELOPMENT"
  ) {
    return window.BASE_PATH || "";
  }

  return window.BASE_PATH || "";
}
