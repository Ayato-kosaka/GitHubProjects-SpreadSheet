namespace config {
  export const baseUrl = "https://api.github.com/graphql";
  export const githubToken =
    PropertiesService.getScriptProperties().getProperty("githubToken");
}
