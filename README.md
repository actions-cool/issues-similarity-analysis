# 👁 Issues Similarity Analysis

![](https://img.shields.io/github/workflow/status/actions-cool/issues-similarity-analysis/CI?style=flat-square)
[![](https://img.shields.io/badge/marketplace-issues--similarity--analysis-blueviolet?style=flat-square)](https://github.com/marketplace/actions/issues-similarity-analysis)
[![](https://img.shields.io/github/v/release/actions-cool/issues-similarity-analysis?style=flat-square&color=orange)](https://github.com/actions-cool/issues-similarity-analysis/releases)

A GitHub Action help you analysis similarity based on the title of issue.

## 👋 Preview

- https://github.com/actions-cool/test-issues-helper/issues/70

## 🚀 How to use?

```yml
name: Issues Similarity Analysis

on:
  issues:
    types: [opened, edited]

jobs:
  similarity-analysis:
    runs-on: ubuntu-latest
    steps:
      - name: analysis
        uses: actions-cool/issues-similarity-analysis@v1
        with:
          filter-threshold: 0.5
          title-excludes: 'bug, not, 1234'
          comment-title: '### See'
          comment-body: '${index}. ${similarity} #${number}'
```

| Name | Desc | Type | Default | Required |
| -- | -- | -- | -- | -- |
| token | GitHub token. | string | GitHub Bot Token | ✖ |
| since-days | How days to query the issues that updated since. | number | 100 | ✖ |
| filter-threshold | Filter issues similarity higher than this threshold. | number | 0.8 | ✖ |
| title-excludes | Exclude words before filter. | string | - | ✖ |
| comment-title | Comment title customization. | string | `### Issues Similarity Analysis:` | ✖ |
| comment-body | Comment body customization. | string | `- [#${number}][${title}][${similarity}]` | ✖ |
| show-footer | Whether show footer. | boolean | true | ✖ |

- `filter-threshold`: Keep in `[0, 1]`
- `comment-body`:
  - The filter issues sort by threshold desc
  - Support `${index}` `${number}` `${title}` `${similarity}`

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/issues-similarity-analysis/issues)
- Submit [Pull Request](https://github.com/actions-cool/issues-similarity-analysis/pulls) to improve the code of `issues-similarity-analysis`

也欢迎加入 钉钉交流群

![](https://github.com/actions-cool/resources/blob/main/dingding.jpeg?raw=true)

## Changelog

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
