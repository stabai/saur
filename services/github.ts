import { isNil } from '../lang/values.ts';

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
  const response = await fetch(`https://api.github.com/repos/${repo.ownerName}/${repo.repoName}/releases`);
  const jsonResponse = await response.json();
  if (isNil(jsonResponse.length)) {
    // If the request fails for any reason, e.g. quota exceeded
    throw new Error(`Unexpected GitHub API response: ${await response.text()}`);
  } else {
    return jsonResponse;
  }
}
