export interface GitHubReleaseJson {
  html_url: string;
  tag_name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  assets: GitHubReleaseAssetJson[];
}

export interface GitHubReleaseAssetJson {
  browser_download_url: string;
  name: string;
  label: string;
  state: string;
  content_type: string;
  size: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  ownerName: string;
  repoName: string;
}

export async function getRepoReleases(repo: GitHubRepo): Promise<GitHubReleaseJson[]> {
  const jsonResponse = await fetch(`https://api.github.com/repos/${repo.ownerName}/${repo.repoName}/releases`);
  return await jsonResponse.json();
}
