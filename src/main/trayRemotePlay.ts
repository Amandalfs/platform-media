import { Menu, Tray } from 'electron'
import net from 'net'
import os from 'os'
let server: net.Server | null
let tray: Tray | null
import icon from '../../resources/icon.png?asset'

import * as http from 'http'

const corsMiddleware = (req, res, next): void => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(200)
    res.end()
    return
  }

  next()
}

const handleRequest = (req: http.IncomingMessage, res: http.ServerResponse): void => {
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json')

    const response = {
      message: 'Olá, este é um exemplo de API HTTP com Node.js e TypeScript!'
    }

    res.end(JSON.stringify(response))
  } else {
    res.statusCode = 405
    res.end('Método não permitido')
  }
}

const serverHttp = http.createServer((req, res) => {
  corsMiddleware(req, res, () => {
    handleRequest(req, res)
  })
})

function createHttpServer(): void {
  const portHttp = 3333
  const IP = getLocalIPAddress()
  serverHttp.listen(portHttp, IP, () => {
    console.log(`Servidor rodando em http:${IP}:${portHttp}`)
  })
}

function stopHttpServer(): void {
  if (serverHttp) {
    serverHttp.close()
  }
}

function createServer(): void {
  server = net.createServer((socket) => {
    console.log('Cliente conectado.')

    socket.on('data', (data) => {
      console.log('Mensagem recebida do cliente:', data.toString())
    })

    socket.on('end', () => {
      console.log('Cliente desconectado.')
    })

    socket.write('Conexão estabelecida com o servidor TCP.\n')
  })

  const PORT = 3000
  server.listen(PORT, '192.168.10.36', () => {
    console.log(`Servidor TCP esta ouvindo na porta ${PORT}`)
  })
}

function stopServer(): void {
  if (server) {
    server.close()
    console.log('Servidor TCP foi desativado.')
  }
}

function getLocalIPAddress(): string | undefined {
  const interfaces = os.networkInterfaces()
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]!) {
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address
      }
    }
  }
  return undefined
}

export function createTray(): void {
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Iniciar Servidor',
      click: createServer
    },
    {
      label: 'Parar Servidor',
      click: stopServer
    },
    {
      label: 'Iniciar Servidor Http',
      click: createHttpServer
    },
    {
      label: 'Parar Servidor Http',
      click: stopHttpServer
    },
    {
      label: 'Info',
      submenu: [
        {
          label: `IP: ${getLocalIPAddress()}`,
          enabled: false
        },
        {
          label: `Porta: 3000`,
          enabled: false
        }
      ]
    }
  ])

  tray.setToolTip('Servidor TCP')
  tray.setContextMenu(contextMenu)
}
