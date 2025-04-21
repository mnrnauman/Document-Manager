"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsItem, TabsList } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Copy, Check, Terminal, Server, Github } from "lucide-react"

export default function DeploymentGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#1e40af] mb-6">Gencore IT Stationery - Deployment Guide</h1>

      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsItem value="local">Local Setup</TabsItem>
          <TabsItem value="github">GitHub Pages</TabsItem>
          <TabsItem value="aws">AWS EC2</TabsItem>
        </TabsList>

        <TabsContent value="local" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Setting Up Locally</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Prerequisites</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Node.js (v16.0.0 or higher)</li>
                  <li>npm (v7.0.0 or higher) or yarn</li>
                  <li>Git</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 1: Clone the repository</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>git clone https://github.com/yourusername/gencore-templates.git</code>
                    <br />
                    <code>cd gencore-templates</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        "git clone https://github.com/yourusername/gencore-templates.git\ncd gencore-templates",
                        "clone",
                      )
                    }
                  >
                    {copied === "clone" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 2: Install dependencies</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>npm install</code>
                    <br />
                    <code># or</code>
                    <br />
                    <code>yarn install</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard("npm install\n# or\nyarn install", "install")}
                  >
                    {copied === "install" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 3: Run the development server</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>npm run dev</code>
                    <br />
                    <code># or</code>
                    <br />
                    <code>yarn dev</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard("npm run dev\n# or\nyarn dev", "dev")}
                  >
                    {copied === "dev" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 4: Access the application</h3>
                <p>
                  Open your browser and navigate to{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">http://localhost:3000</code>
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="github" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Deploying to GitHub Pages</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Step 1: Add a GitHub workflow file</h3>
                <p className="mb-2">
                  Create <code className="bg-gray-100 px-1 py-0.5 rounded">.github/workflows/deploy.yml</code>:
                </p>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npm run build
      - run: npm run export
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - run: npm ci
      - run: npm run build
      - run: npm run export
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out`,
                        "workflow",
                      )
                    }
                  >
                    {copied === "workflow" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 2: Update Next.js config</h3>
                <p className="mb-2">
                  Modify <code className="bg-gray-100 px-1 py-0.5 rounded">next.config.mjs</code>:
                </p>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/gencore-templates',
};

export default nextConfig;`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/gencore-templates',
};

export default nextConfig;`,
                        "nextconfig",
                      )
                    }
                  >
                    {copied === "nextconfig" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 3: Add export script to package.json</h3>
                <p className="mb-2">
                  Add this to your scripts in <code className="bg-gray-100 px-1 py-0.5 rounded">package.json</code>:
                </p>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`"scripts": {
  "dev": "next dev",
  "build": "next build",
  "export": "next export",
  "start": "next start",
  "lint": "next lint"
}`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `"scripts": {
  "dev": "next dev",
  "build": "next build",
  "export": "next export",
  "start": "next start",
  "lint": "next lint"
}`,
                        "scripts",
                      )
                    }
                  >
                    {copied === "scripts" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 4: Push to GitHub</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>git add .</code>
                    <br />
                    <code>git commit -m "Setup for GitHub Pages"</code>
                    <br />
                    <code>git push</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `git add .
git commit -m "Setup for GitHub Pages"
git push`,
                        "push",
                      )
                    }
                  >
                    {copied === "push" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 5: Enable GitHub Pages</h3>
                <p>
                  In your repository settings, enable GitHub Pages and select the{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded">gh-pages</code> branch.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aws" className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Deploying to AWS EC2</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Step 1: Launch an EC2 instance</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Choose Amazon Linux 2 or Ubuntu</li>
                  <li>Configure security groups to allow HTTP (port 80) and HTTPS (port 443)</li>
                  <li>Create or use an existing key pair</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 2: Connect to your instance</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>ssh -i your-key.pem ec2-user@your-instance-ip</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard("ssh -i your-key.pem ec2-user@your-instance-ip", "ssh")}
                  >
                    {copied === "ssh" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 3: Install dependencies</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`# For Amazon Linux
sudo yum update -y
sudo yum install -y nodejs npm git

# For Ubuntu
sudo apt update
sudo apt install -y nodejs npm git`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `# For Amazon Linux
sudo yum update -y
sudo yum install -y nodejs npm git

# For Ubuntu
sudo apt update
sudo apt install -y nodejs npm git`,
                        "deps",
                      )
                    }
                  >
                    {copied === "deps" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 4: Clone and set up the application</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`git clone https://github.com/yourusername/gencore-templates.git
cd gencore-templates
npm install
npm run build`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `git clone https://github.com/yourusername/gencore-templates.git
cd gencore-templates
npm install
npm run build`,
                        "setup",
                      )
                    }
                  >
                    {copied === "setup" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 5: Install and configure PM2</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`sudo npm install -g pm2
pm2 start npm --name "gencore-templates" -- start
pm2 startup
pm2 save`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `sudo npm install -g pm2
pm2 start npm --name "gencore-templates" -- start
pm2 startup
pm2 save`,
                        "pm2",
                      )
                    }
                  >
                    {copied === "pm2" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 6: Set up Nginx as a reverse proxy</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`sudo yum install -y nginx  # or apt install for Ubuntu
sudo nano /etc/nginx/conf.d/gencore-templates.conf`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `sudo yum install -y nginx  # or apt install for Ubuntu
sudo nano /etc/nginx/conf.d/gencore-templates.conf`,
                        "nginx-install",
                      )
                    }
                  >
                    {copied === "nginx-install" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>

                <p className="mt-4 mb-2">Add the following configuration:</p>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`,
                        "nginx-conf",
                      )
                    }
                  >
                    {copied === "nginx-conf" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 7: Start Nginx and enable it on boot</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`sudo systemctl start nginx
sudo systemctl enable nginx`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `sudo systemctl start nginx
sudo systemctl enable nginx`,
                        "nginx-start",
                      )
                    }
                  >
                    {copied === "nginx-start" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Step 8: Set up SSL with Certbot (optional)</h3>
                <div className="bg-gray-50 p-3 rounded-md relative">
                  <pre className="text-sm overflow-x-auto">
                    <code>{`sudo yum install -y certbot python-certbot-nginx  # or apt install for Ubuntu
sudo certbot --nginx -d your-domain.com`}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      copyToClipboard(
                        `sudo yum install -y certbot python-certbot-nginx  # or apt install for Ubuntu
sudo certbot --nginx -d your-domain.com`,
                        "ssl",
                      )
                    }
                  >
                    {copied === "ssl" ? <Check size={16} /> : <Copy size={16} />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold text-[#1e40af] mb-4">Project Architecture</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Technologies Used</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Next.js 14:</strong> React framework with server-side rendering
              </li>
              <li>
                <strong>React 18:</strong> JavaScript library for building user interfaces
              </li>
              <li>
                <strong>Tailwind CSS:</strong> Utility-first CSS framework
              </li>
              <li>
                <strong>html2canvas:</strong> Captures DOM elements as canvas
              </li>
              <li>
                <strong>jsPDF:</strong> Converts canvas to PDF documents
              </li>
              <li>
                <strong>React Hooks:</strong> For component-level state management
              </li>
              <li>
                <strong>Local Storage:</strong> For persisting form data between sessions
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Project Structure</h3>
            <div className="bg-gray-50 p-3 rounded-md">
              <pre className="text-sm overflow-x-auto">
                <code>{`gencore-templates/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page component
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── invoice.tsx       # Invoice template
│   ├── invoice-editor.tsx # Invoice editor
│   ├── letterhead.tsx    # Letterhead template
│   ├── letterhead-editor.tsx # Letterhead editor
│   ├── quotation.tsx     # Quotation template
│   ├── quotation-editor.tsx # Quotation editor
│   ├── template-selector.tsx # Template selection component
│   └── ui/               # UI components (buttons, inputs, etc.)
├── hooks/                # Custom React hooks
│   └── use-toast.ts      # Toast notification hook
├── utils/                # Utility functions
│   └── pdf-generator.ts  # PDF generation utility
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
└── next.config.mjs       # Next.js configuration`}</code>
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Design and Styling</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium">Font Selection</h4>
                <p>The project uses a system font stack with Inter as the primary font:</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <pre className="text-sm overflow-x-auto">
                    <code>
                      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
                      Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    </code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Color Scheme</h4>
                <div className="flex flex-wrap gap-4 mt-2">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-md bg-[#1e40af]"></div>
                    <span className="text-xs mt-1">Primary Blue</span>
                    <span className="text-xs text-gray-500">#1e40af</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-md bg-[#f97316]"></div>
                    <span className="text-xs mt-1">Secondary Orange</span>
                    <span className="text-xs text-gray-500">#f97316</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-md bg-gray-100"></div>
                    <span className="text-xs mt-1">Light Gray</span>
                    <span className="text-xs text-gray-500">#f3f4f6</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-md bg-gray-700"></div>
                    <span className="text-xs mt-1">Dark Gray</span>
                    <span className="text-xs text-gray-500">#374151</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium">Print Optimization</h4>
                <p>Special CSS rules were implemented for print media:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    Removing shadows and borders:{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">print:shadow-none print:border-0</code>
                  </li>
                  <li>
                    Ensuring backgrounds print:{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">-webkit-print-color-adjust: exact</code>
                  </li>
                  <li>
                    Strategic page breaks:{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">page-break-after: always</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 justify-center">
        <Button className="flex items-center gap-2">
          <Terminal size={16} />
          View Documentation
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Github size={16} />
          View Source Code
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Server size={16} />
          Deployment Options
        </Button>
      </div>
    </div>
  )
}
