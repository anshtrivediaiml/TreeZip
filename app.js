const { useState, useEffect } = React;

// Lucide Icons as SVG components
const FolderTree = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"></path>
        <path d="M2 10h20"></path>
    </svg>
);

const FileText = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <line x1="10" y1="9" x2="8" y2="9"></line>
    </svg>
);

const Archive = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="4" width="20" height="5" rx="2"></rect>
        <path d="M4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9"></path>
        <path d="M10 13h4"></path>
    </svg>
);

const Sparkles = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
        <path d="M5 3v4"></path>
        <path d="M19 17v4"></path>
        <path d="M3 5h4"></path>
        <path d="M17 19h4"></path>
    </svg>
);

const Zap = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
);

const App = () => {
    const [input, setInput] = useState(`├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   ├── client.ts
│   │   ├── auth.ts
│   │   ├── captions.ts
│   │   ├── contentIdeas.ts
│   │   ├── analytics.ts
│   │   ├── scheduler.ts
│   │   └── profile.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── Sidebar.tsx
│   │       ├── Topbar.tsx
│   │       └── AppLayout.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   └── pages/
│       ├── auth/
│       │   ├── LoginPage.tsx
│       │   └── RegisterPage.tsx
│       ├── DashboardPage.tsx
│       ├── CaptionGeneratorPage.tsx
│       ├── ContentIdeasPage.tsx
│       └── SchedulerPage.tsx`);

    const [structure, setStructure] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [stats, setStats] = useState({ folders: 0, files: 0 });

    const parseTree = (treeText) => {
        const lines = treeText.split('\n').filter(line => line.trim());
        const root = { name: 'root', type: 'folder', children: [], path: '' };
        const stack = [{ node: root, depth: -1 }];
        let folderCount = 0;
        let fileCount = 0;

        lines.forEach(line => {
            const cleaned = line.replace(/[│├└─\s]/g, match => {
                if (match === ' ') return ' ';
                return '';
            }).trim();

            if (!cleaned) return;

            const leadingSpaces = line.search(/[├└│]/) !== -1 ?
                line.substring(0, line.search(/[├└]/)).replace(/[^│]/g, ' ').length : 0;
            const depth = Math.floor(leadingSpaces / 4);

            const isFolder = cleaned.endsWith('/');
            const name = isFolder ? cleaned.slice(0, -1) : cleaned;
            const type = isFolder ? 'folder' : 'file';

            if (isFolder) folderCount++;
            else fileCount++;

            while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
                stack.pop();
            }

            const parent = stack[stack.length - 1].node;
            const path = parent.path ? `${parent.path}/${name}` : name;

            const node = { name, type, children: [], path };
            parent.children.push(node);

            if (isFolder) {
                stack.push({ node, depth });
            }
        });

        setStats({ folders: folderCount, files: fileCount });
        return root.children;
    };

    const generateStructure = () => {
        try {
            const parsed = parseTree(input);
            setStructure(parsed);
        } catch (error) {
            alert('Error parsing tree structure. Please check your input format.');
        }
    };

    const generateAndDownloadZip = async () => {
        if (!structure) {
            alert('Please generate structure first!');
            return;
        }

        if (!window.JSZip) {
            alert('ZIP library is still loading. Please wait a moment and try again.');
            return;
        }

        setIsGenerating(true);

        try {
            const zip = new JSZip();

            const addToZip = (nodes, currentPath = '') => {
                nodes.forEach(node => {
                    const fullPath = currentPath ? `${currentPath}/${node.name}` : node.name;

                    if (node.type === 'folder') {
                        zip.folder(fullPath);
                        if (node.children.length > 0) {
                            addToZip(node.children, fullPath);
                        }
                    } else {
                        zip.file(fullPath, '');
                    }
                });
            };

            addToZip(structure);

            const content = await zip.generateAsync({ type: 'blob' });

            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'project-structure.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setIsGenerating(false);
        } catch (error) {
            console.error('Error generating zip:', error);
            alert('Error generating zip file. Please try again.');
            setIsGenerating(false);
        }
    };

    const renderTree = (nodes, depth = 0) => {
        return nodes.map((node, idx) => (
            <div key={idx} style={{ marginLeft: `${depth * 20}px` }} className="py-1 group">
                <div className="flex items-center gap-2 hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent rounded px-2 py-1 transition-all">
                    {node.type === 'folder' ? (
                        <FolderTree className="w-4 h-4 text-purple-600" />
                    ) : (
                        <FileText className="w-4 h-4 text-blue-500" />
                    )}
                    <span className={node.type === 'folder' ? 'font-semibold text-purple-700' : 'text-gray-700'}>
                        {node.name}{node.type === 'folder' ? '/' : ''}
                    </span>
                </div>
                {node.children.length > 0 && (
                    <div className="tree-line">
                        {renderTree(node.children, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="min-h-screen gradient-bg">
            {/* Floating decoration elements */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="fixed top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
            <div className="fixed bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

            <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <div className="inline-block float mb-4">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-2xl shadow-2xl">
                                <Archive className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight">
                            Tree<span className="text-yellow-300">Zip</span>
                        </h1>
                        <p className="text-white text-lg sm:text-xl mb-2 font-medium">
                            ASCII Tree → ZIP Structure Generator
                        </p>
                        <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto">
                            Convert your project structure diagrams into actual file hierarchies instantly
                        </p>
                        
                        {/* Stats badges */}
                        {structure && (
                            <div className="flex justify-center gap-3 mt-6">
                                <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
                                    <FolderTree className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-semibold text-gray-700">{stats.folders} folders</span>
                                </div>
                                <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-semibold text-gray-700">{stats.files} files</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Input Section */}
                        <div className="glass rounded-3xl shadow-2xl p-6 sm:p-8 transform hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Input ASCII Tree</h2>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full h-80 sm:h-96 p-4 border-2 border-purple-200 rounded-2xl font-mono text-sm focus:ring-4 focus:ring-purple-300 focus:border-purple-400 transition-all resize-none"
                                placeholder="Paste your ASCII tree structure here...

Example:
├── src/
│   ├── components/
│   │   └── Header.tsx
│   └── App.tsx"
                            />
                            <button
                                onClick={generateStructure}
                                className="mt-6 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-xl glow"
                            >
                                <Zap className="w-5 h-5" />
                                Generate Structure
                            </button>
                        </div>

                        {/* Output Section */}
                        <div className="glass rounded-3xl shadow-2xl p-6 sm:p-8 transform hover:scale-[1.01] transition-transform">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                                    <FolderTree className="w-5 h-5 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Preview & Download</h2>
                            </div>

                            {structure ? (
                                <>
                                    <div className="h-80 sm:h-96 overflow-y-auto border-2 border-purple-200 rounded-2xl p-4 bg-gradient-to-br from-white to-purple-50 mb-6 hover:border-purple-300 transition-colors">
                                        {renderTree(structure)}
                                    </div>

                                    <button
                                        onClick={generateAndDownloadZip}
                                        disabled={isGenerating}
                                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all transform hover:scale-105 active:scale-95 disabled:scale-100 flex items-center justify-center gap-3 shadow-xl glow"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                Generating ZIP...
                                            </>
                                        ) : (
                                            <>
                                                <Archive className="w-5 h-5" />
                                                Download ZIP File
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-green-600 rounded-lg mt-0.5">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <p className="text-sm text-green-800 font-medium">
                                                Ready to download! Click the button above to get your complete project structure as a ZIP file.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-80 sm:h-96 flex items-center justify-center text-gray-400 border-2 border-dashed border-purple-200 rounded-2xl bg-gradient-to-br from-white to-purple-50">
                                    <div className="text-center p-8">
                                        <div className="inline-block float mb-4">
                                            <FolderTree className="w-16 h-16 mx-auto opacity-30" />
                                        </div>
                                        <p className="text-lg font-medium">Generate structure to see preview</p>
                                        <p className="text-sm mt-2">Paste your tree and click the button →</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* How to Use Section */}
                    <div className="mt-8 lg:mt-12 glass rounded-3xl shadow-2xl p-6 sm:p-8">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                            <span className="text-3xl">🚀</span>
                            How to Use
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all">
                                <div className="text-2xl font-bold text-purple-600 mb-2">01</div>
                                <h4 className="font-semibold text-gray-800 mb-1">Paste Tree</h4>
                                <p className="text-sm text-gray-600">Copy your ASCII tree structure (folders end with /)</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all">
                                <div className="text-2xl font-bold text-blue-600 mb-2">02</div>
                                <h4 className="font-semibold text-gray-800 mb-1">Generate</h4>
                                <p className="text-sm text-gray-600">Click to parse and preview your structure</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all">
                                <div className="text-2xl font-bold text-green-600 mb-2">03</div>
                                <h4 className="font-semibold text-gray-800 mb-1">Download</h4>
                                <p className="text-sm text-gray-600">Get your ZIP with the complete hierarchy</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-yellow-50 to-white rounded-2xl border-2 border-yellow-100 hover:border-yellow-300 transition-all">
                                <div className="text-2xl font-bold text-yellow-600 mb-2">04</div>
                                <h4 className="font-semibold text-gray-800 mb-1">Extract & Code</h4>
                                <p className="text-sm text-gray-600">Unzip and start building instantly!</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center text-white/80 text-sm">
                        <p>Made with ❤️ for developers who love automation</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);