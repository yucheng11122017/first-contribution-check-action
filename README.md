# First Contribution Check Action

This action checks if any of the authors is a new contributor to a repository.

## Usage

### Pre-requisites

Create a workflow .yml file in your repositories .github/workflows directory.

### Outputs

#### `FIRST_TIME_CONTRIBUTORS`

Array which contains the first time contributors


## Getting Started

If you're new to actions, add these to your .github/workflows/main.yml file. If this file does not exist, create one.

```yml
on:
  push:
    branches:
        - main

jobs:
  contrib-readme-job:
    runs-on: ubuntu-latest
    name: A job to find if a commitor is new to contribute.
    steps:
      - name: First Contribution Check
        uses: yucheng11122017/first-contribution-check-action@v1.0.0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      - name: Print Output of Previous Step
        run: |
          echo 'first-check output is ${{ steps.first-check.outputs.FIRST_TIME_CONTRIBUTORS }}'
```

That's it!

To add it to your to your existing workflow, append this to your current `.yml` workflow script.

```yml
uses: yucheng11122017/first-contribution-check-action@v1.0.0
env:
  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
