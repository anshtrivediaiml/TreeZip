const { useState } = React;

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

const Sun = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="4"></circle>
        <path d="M12 2v2"></path>
        <path d="M12 20v2"></path>
        <path d="m4.93 4.93 1.41 1.41"></path>
        <path d="m17.66 17.66 1.41 1.41"></path>
        <path d="M2 12h2"></path>
        <path d="M20 12h2"></path>
        <path d="m6.34 17.66-1.41 1.41"></path>
        <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
);

const Moon = ({ className }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
    </svg>
);

const App = () => {
    const [darkMode, setDarkMode] = useState(false);
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
│   │   │   └── Toast.tsx`);

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
                <div className={`flex items-center gap-2 rounded px-2 py-1 transition-all ${
                    darkMode 
                        ? 'hover:bg-purple-900/30' 
                        : 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent'
                }`}>
                    {node.type === 'folder' ? (
                        <FolderTree className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    ) : (
                        <FileText className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    )}
                    <span className={`${
                        node.type === 'folder' 
                            ? darkMode ? 'font-semibold text-purple-300' : 'font-semibold text-purple-700'
                            : darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        {node.name}{node.type === 'folder' ? '/' : ''}
                    </span>
                </div>
                {node.children.length > 0 && (
                    <div className={`tree-line ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        {renderTree(node.children, depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${
            darkMode 
                ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
                : 'gradient-bg'
        }`}>
            {/* Floating decoration elements */}
            <div className={`fixed top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
                darkMode ? 'bg-purple-500' : 'bg-purple-300'
            }`}></div>
            <div className={`fixed top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
                darkMode ? 'bg-blue-500' : 'bg-blue-300'
            }`} style={{ animationDelay: '1s' }}></div>
            <div className={`fixed bottom-20 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
                darkMode ? 'bg-pink-500' : 'bg-pink-300'
            }`} style={{ animationDelay: '2s' }}></div>

            <div className="relative min-h-screen p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Dark Mode Toggle Button */}
                    <div className="absolute top-4 right-4 z-50">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-3 rounded-full transition-all transform hover:scale-110 active:scale-95 shadow-lg ${
                                darkMode 
                                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                                    : 'bg-white text-purple-600 hover:bg-purple-50'
                            }`}
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12 pt-8">
                        <div className="inline-block float mb-4">
                            <div className={`p-4 rounded-2xl shadow-2xl ${
                                darkMode 
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                                    : 'bg-gradient-to-r from-purple-600 to-blue-600'
                            }`}>
                                <Archive className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight ${
                            darkMode ? 'text-white' : 'text-white'
                        }`}>
                            Tree<span className="text-yellow-300">Zip</span>
                        </h1>
                        <p className={`text-lg sm:text-xl mb-2 font-medium ${
                            darkMode ? 'text-gray-200' : 'text-white'
                        }`}>
                            ASCII Tree → ZIP Structure Generator
                        </p>
                        <p className={`text-sm sm:text-base max-w-2xl mx-auto ${
                            darkMode ? 'text-gray-400' : 'text-white/80'
                        }`}>
                            Convert your project structure diagrams into actual file hierarchies instantly
                        </p>
                        
                        {/* Stats badges */}
                        {structure && (
                            <div className="flex justify-center gap-3 mt-6">
                                <div className={`rounded-full px-4 py-2 flex items-center gap-2 ${
                                    darkMode 
                                        ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' 
                                        : 'glass'
                                }`}>
                                    <FolderTree className={`w-4 h-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {stats.folders} folders
                                    </span>
                                </div>
                                <div className={`rounded-full px-4 py-2 flex items-center gap-2 ${
                                    darkMode 
                                        ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' 
                                        : 'glass'
                                }`}>
                                    <FileText className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                        {stats.files} files
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                        {/* Input Section */}
                        <div className={`rounded-3xl shadow-2xl p-6 sm:p-8 transform hover:scale-[1.01] transition-all ${
                            darkMode 
                                ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' 
                                : 'glass'
                        }`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 rounded-xl ${
                                    darkMode 
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                                        : 'bg-gradient-to-r from-purple-600 to-blue-600'
                                }`}>
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Input ASCII Tree
                                </h2>
                            </div>
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className={`w-full h-80 sm:h-96 p-4 rounded-2xl font-mono text-sm transition-all resize-none ${
                                    darkMode 
                                        ? 'bg-gray-900 border-2 border-gray-700 text-gray-200 focus:ring-4 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500' 
                                        : 'border-2 border-purple-200 focus:ring-4 focus:ring-purple-300 focus:border-purple-400'
                                }`}
                                placeholder={`Paste your ASCII tree structure here...

Example:
├── src/
│   ├── components/
│   │   └── Header.tsx
│   └── App.tsx`}
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
                        <div className={`rounded-3xl shadow-2xl p-6 sm:p-8 transform hover:scale-[1.01] transition-all ${
                            darkMode 
                                ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' 
                                : 'glass'
                        }`}>
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`p-2 rounded-xl ${
                                    darkMode 
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600'
                                }`}>
                                    <FolderTree className="w-5 h-5 text-white" />
                                </div>
                                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    Preview & Download
                                </h2>
                            </div>

                            {structure ? (
                                <>
                                    <div className={`h-80 sm:h-96 overflow-y-auto rounded-2xl p-4 mb-6 transition-all ${
                                        darkMode 
                                            ? 'border-2 border-gray-700 bg-gradient-to-br from-gray-900 to-purple-900/30 hover:border-purple-500' 
                                            : 'border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50 hover:border-purple-300'
                                    }`}>
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

                                    <div className={`mt-4 p-4 rounded-2xl ${
                                        darkMode 
                                            ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border-2 border-green-700' 
                                            : 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                                    }`}>
                                        <div className="flex items-start gap-3">
                                            <div className="p-1 bg-green-600 rounded-lg mt-0.5">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                            </div>
                                            <p className={`text-sm font-medium ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                                                Ready to download! Click the button above to get your complete project structure as a ZIP file.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className={`h-80 sm:h-96 flex items-center justify-center border-2 border-dashed rounded-2xl ${
                                    darkMode 
                                        ? 'border-gray-700 bg-gradient-to-br from-gray-900 to-purple-900/30 text-gray-500' 
                                        : 'border-purple-200 bg-gradient-to-br from-white to-purple-50 text-gray-400'
                                }`}>
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
                    <div className={`mt-8 lg:mt-12 rounded-3xl shadow-2xl p-6 sm:p-8 ${
                        darkMode 
                            ? 'bg-gray-800/80 backdrop-blur-sm border border-gray-700' 
                            : 'glass'
                    }`}>
                        <h3 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
                            darkMode ? 'text-white' : 'text-gray-800'
                        }`}>
                            <span className="text-3xl">🚀</span>
                            How to Use
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { num: '01', title: 'Paste Tree', desc: 'Copy your ASCII tree structure (folders end with /)', color: 'purple' },
                                { num: '02', title: 'Generate', desc: 'Click to parse and preview your structure', color: 'blue' },
                                { num: '03', title: 'Download', desc: 'Get your ZIP with the complete hierarchy', color: 'green' },
                                { num: '04', title: 'Extract & Code', desc: 'Unzip and start building instantly!', color: 'yellow' }
                            ].map((step, idx) => (
                                <div key={idx} className={`p-4 rounded-2xl transition-all ${
                                    darkMode 
                                        ? `bg-gradient-to-br from-${step.color}-900/20 to-gray-900/20 border-2 border-${step.color}-800 hover:border-${step.color}-600` 
                                        : `bg-gradient-to-br from-${step.color}-50 to-white border-2 border-${step.color}-100 hover:border-${step.color}-300`
                                }`}>
                                    <div className={`text-2xl font-bold mb-2 ${
                                        darkMode ? `text-${step.color}-400` : `text-${step.color}-600`
                                    }`}>{step.num}</div>
                                    <h4 className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                        {step.title}
                                    </h4>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className={`mt-8 text-center text-sm ${
                        darkMode ? 'text-gray-400' : 'text-white/80'
                    }`}>
                        <p>Made with ❤️ for developers who love automation</p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .gradient-bg {
                    background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #4facfe);
                    background-size: 400% 400%;
                    animation: gradient 15s ease infinite;
                }
                .glass {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .glow {
                    box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .float {
                    animation: float 6s ease-in-out infinite;
                }
                .tree-line {
                    border-left: 2px solid;
                    padding-left: 1rem;
                    margin-left: 0.5rem;
                }
            `}</style>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
