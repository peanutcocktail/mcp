const path = require('path')
module.exports = async (kernel) => {
  let root;
  if (kernel.platform === "win32") {
    root = path.resolve(kernel.envs.HOME, 'Library/Application Support/Claude/claude_desktop_config.json')
  } else {
    root = path.resolve(kernel.envs.APPDATA, 'Claude/claude_desktop_config.json')
  }
  return {
    run: [
      {
        method: "shell.run",
        params: {
          message: [
            "conda install -y conda-forge::uv"
          ],
        }
      },
      {
        method: "shell.run",
        params: {
          message: "mkdir {{kernel.path('MCP')}}"
        }
      },
      {
        method: "shell.run",
        params: {
          message: [
            "npm install",
            "node index {{kernel.path('MCP/test.db')}}"
          ],
          path: "sqlite"
        }
      },
      {
        method: "fs.write",
        params: {
          path: root,
          json2: {
            "mcpServers": {
              "sqlite": {
                "env": {
                  "PATH": "{{kernel.envs.PATH || kernel.envs.Path}}",
                },
                "command": "uvx",
                "args": [
                  "mcp-server-sqlite",
                  "--db-path",
                  "{{kernel.path('MCP/test.db')}}"
                ]
              },
              "filesystem": {
                "env": {
                  "PATH": "{{kernel.envs.PATH || kernel.envs.Path}}",
                },
                "command": "npx",
                "args": [
                  "-y",
                  "@modelcontextprotocol/server-filesystem",
                  "/Users/username/Desktop",
                  "/path/to/other/allowed/dir"
                ]
              },
              "github": {
                "env": {
                  "GITHUB_PERSONAL_ACCESS_TOKEN": "{{kernel.envs.GITHUB_PERSONAL_ACCESS_TOKEN}}"
                },
                "command": "npx",
                "args": [
                  "-y",
                  "@modelcontextprotocol/server-github"
                ],
              },
              "gitlab": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                  "GITLAB_PERSONAL_ACCESS_TOKEN": "{{kernel.envs.GITLAB_PERSONAL_ACCESS_TOKEN}}",
                  "GITLAB_API_URL": "{{kernel.envs.GITLAB_API_URL}}"
                },
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-gitlab"],
              },
              "memory": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                },
                "command": "npx",
                "args": [
                  "-y",
                  "@modelcontextprotocol/server-memory"
                ]
              },
              "puppeteer": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                },
                "command": "npx",
                "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
              },
              "brave-search": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                  "BRAVE_API_KEY": "{{kernel.envs.BRAVE_API_KEY}}"
                },
                "command": "npx",
                "args": [
                  "-y",
                  "@modelcontextprotocol/server-brave-search"
                ]
              },
              "fetch": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                },
                "command": "uvx",
                "args": ["mcp-server-fetch"]
              },
              "git": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                },
                "command": "uvx",
                "args": ["mcp-server-git", "--repository", "path/to/git/repo"]
              },
              "google-maps": {
                "env": {
                  "PATH": "{{kernel.envs.PATH}}",
                  "GOOGLE_MAPS_API_KEY": "{{kernel.envs.GOOGLE_MAPS_API_KEY}}"
                },
                "command": "npx",
                "args": [
                  "-y",
                  "@modelcontextprotocol/server-google-maps"
                ],
              }
            }
          }
        }
      },
    ]
  }
}
