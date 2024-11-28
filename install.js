module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",                // Edit this to customize the venv folder path
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
      when: "{{platform === 'darwin'}}",
      method: "fs.write",
      params: {
        path: "{{env.HOME}}/Library/Application Support/Claude/claude_desktop_config.json",
        json2: {
          "mcpServers": {
            "sqlite": {
              "command": "uvx",
              "env": {
                "HOME": "{{kernel.envs.HOME}}",
                "PATH": "{{kernel.envs.PATH}}",
              },
              "args": [
                "mcp-server-sqlite",
                "--db-path",
                "{{kernel.path('MCP/test.db')}}"
              ]
            }
          }
        }
      }
    },
    {
      when: "{{platform === 'win32'}}",
      method: "fs.write",
      params: {
        path: "{{path.resolve(env.APPDATA, 'Claude/claude_desktop_config.json')}}",
        json2: {
          "mcpServers": {
            "sqlite": {
              "command": "uvx",
              "env": {
                "HOME": "{{kernel.envs.HOME}}",
                "PATH": "{{kernel.envs.PATH}}",
              },
              "args": [
                "mcp-server-sqlite",
                "--db-path",
                "{{kernel.path('MCP/test.db')}}"
              ]
            }
          }
        }
      }
    }
  ]
}
