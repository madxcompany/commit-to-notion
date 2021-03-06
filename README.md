# commit-to-notion

Our company uses Note as an issue tracker.

These are github actions that help you manage your commit history.

## Usage
Create a .github/workflow/{filename}.yml file.
```.yml
name: Commit
on:
  push

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Commit to Notion
        uses: madxcompany/commit-to-notion@v0.1.1
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY }}
          NOTION_DATABASE: ${{ secrets.NOTION_DATABASE }}
```

## Check
1. Setting database issue code
   1. Formula -> slice(id(), round(toNumber(replaceAll(id(), "[^0-9]", "")) % 4), 6)
2. Commit History Area
   1. Commit history area is first toggle area in database pages
3. Write commit message format 
   1. "#{issue_code} first commit" -> "#2af008 first commit"


## Inputs
* GITHUB_TOKEN (required)
* NOTION_API_KEY (required)
* NOTION_DATABASE (required)

[Get Notion API KEY](https://developers.notion.com/docs/getting-started#step-1-create-an-integration)

[Get Notion DATABSE](https://stackoverflow.com/questions/67728038/where-to-find-database-id-for-my-database-in-notion)

## LICENSE
[LICENSE](https://github.com/madxcompany/commit-to-notion/blob/main/LICENSE)
