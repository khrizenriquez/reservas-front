const renderV1Profile = {
  source: "https://umg-api-django.onrender.com/api/schema/?format=json",
  snapshot: "specs/contracts/render-v1-openapi.yaml",
  sha256: "cf06534e4de203c4b6c5490d4fe3501626601f4bfdd2e974d715fd66a6e68bc5",
  requiredPaths: {
    "/api/auth/login/": ["post"],
    "/api/labs/": ["get", "post"]
  }
};

const renderV1Manifest = {
  profiles: {
    "render-v1": renderV1Profile
  }
};

const renderV1Schema = {
  paths: {
    "/api/auth/login/": { post: {} },
    "/api/labs/": { get: {}, post: {} }
  }
};

module.exports = {
  renderV1Manifest,
  renderV1Profile,
  renderV1Schema
};
