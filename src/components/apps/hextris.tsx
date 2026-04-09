"use client";

/**
 * Hextris Application Component
 * 
 * Renders the Hextris game wrapped in a high-fidelity landing page.
 */
export function HextrisApp() {
  const hextrisHtml = `<!DOCTYPE html>
<html lang="en"> 
<head> 
    <!-- Google tag (gtag.js) --> 
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XH0EF8F2YX"></script> 
    <script> 
        window.dataLayer = window.dataLayer || []; 
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date()); 
        gtag('config', 'G-XH0EF8F2YX'); 
    </script>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hextris - Addictive Hexagonal Puzzle Game | Play Free Online</title>
    <meta name="description" content="Play Hextris, the addictive hexagonal puzzle game with unique color-matching mechanics. Experience this innovative twist on classic block puzzles for free online.">
    <meta name="keywords" content="hextris, hexagon game, puzzle game, tetris alternative, online game, free puzzle game, block game">
    <link rel="canonical" href="https://hextris.online">

    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="Hextris - Addictive Hexagonal Puzzle Game">
    <meta property="og:description" content="Match three sides of the same color to clear blocks in this innovative puzzle game.">
    <meta property="og:url" content="https://hextris.online">
    <meta property="og:type" content="website">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Hextris - Play Free Online">
    <meta name="twitter:description" content="An addictive hexagonal puzzle game with unique color-matching mechanics.">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        :root {
            --apple-blue: #007AFF;
            --apple-indigo: #5856D6;
            --apple-purple: #AF52DE;
            --apple-pink: #FF2D55;
            --apple-red: #FF3B30;
            --apple-orange: #FF9500;
            --apple-yellow: #FFCC00;
            --apple-green: #34C759;
            --apple-teal: #5AC8FA;
            --apple-gray: #8E8E93;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            color: #333;
            line-height: 1.6;
        }
        
        .apple-gradient {
            background: linear-gradient(135deg, var(--apple-blue), var(--apple-purple));
        }
        
        .game-container {
            aspect-ratio: 4/3;
            max-height: 80vh;
            border: 4px solid var(--apple-blue);
            border-radius: 0.5rem;
            overflow: hidden;
        }
        
        @media (max-width: 768px) {
            .game-container {
                aspect-ratio: 1/1;
                height: 70vh;
                max-height: 500px;
            }
        }
        
        .btn-primary {
            background-color: var(--apple-blue);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            background-color: var(--apple-indigo);
            transform: translateY(-2px);
        }
        
        .text-apple-blue { color: var(--apple-blue); }
        .text-apple-purple { color: var(--apple-purple); }
        .text-apple-green { color: var(--apple-green); }
        .text-apple-orange { color: var(--apple-orange); }
        .bg-apple-blue { background-color: var(--apple-blue); }
        .bg-apple-purple { background-color: var(--apple-purple); }
        .border-apple-blue { border-color: var(--apple-blue); }
    </style>
</head> 
<body class="bg-gray-50"> 
    <!-- Header --> 
    <header class="apple-gradient text-white p-4 md:p-6 shadow-lg"> 
        <div class="container mx-auto"> 
            <nav class="flex justify-between items-center mb-8"> 
                <div class="text-xl md:text-2xl font-bold">Hextris.online</div> 
                <div class="hidden md:flex space-x-6"> 
                    <a href="#how-to-play" class="hover:text-yellow-300 transition-colors">How to Play</a> 
                    <a href="#about" class="hover:text-yellow-300 transition-colors">About</a> 
                    <a href="#features" class="hover:text-yellow-300 transition-colors">Features</a> 
                </div> 
                <button class="md:hidden text-2xl" aria-label="Menu">≡</button> 
            </nav>
            <div class="text-center py-6 md:py-10">
                <h1 class="text-3xl md:text-5xl font-bold mb-4">Hextris</h1>
                <p class="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
                    An addictive puzzle game where you match hexagonal blocks of the same color to clear the board
                </p>
                <div class="mt-6">
                    <a href="#play-now" class="btn-primary inline-block">Play Now</a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Game Section -->
        <section id="play-now" class="mb-16">
            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <div class="game-container w-full mx-auto">
                    <iframe src="https://white1dove.github.io/hextris/" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="p-4 md:p-6 text-center bg-gray-100">
                    <p class="font-medium text-gray-700">Use arrow keys or swipe to move blocks. Match three sides of the same color to clear them!</p>
                </div>
            </div>
        </section>
        
        <!-- How to Play Section -->
        <section id="how-to-play" class="mb-16">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-apple-blue">How to Play Hextris</h2>
            <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
                <div class="grid md:grid-cols-3 gap-6">
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-xl font-semibold mb-3 text-apple-purple">Game Controls</h3>
                        <p>Use your keyboard arrows or swipe motions on mobile to move and rotate the falling hexagonal blocks. Place them strategically to match colors.</p>
                    </div>
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-xl font-semibold mb-3 text-apple-purple">Matching Mechanics</h3>
                        <p>When three sides of the same color connect, those sides will disappear, making room for more blocks. The longer you play, the faster blocks will fall!</p>
                    </div>
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="text-xl font-semibold mb-3 text-apple-purple">Scoring System</h3>
                        <p>Earn points for each cleared side. Chain reactions and combos will boost your score. How high can you go? Challenge your friends to beat your high score!</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- About Hextris Section -->
        <section id="about" class="mb-16">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-apple-blue">About Hextris</h2>
            <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
                <div class="prose max-w-none">
                    <p class="mb-4">Hextris is an innovative puzzle game that combines elements of classic block-falling games with a hexagonal twist. Instead of traditional square blocks, Hextris challenges players with hexagonal shapes that must be matched based on color.</p>
                    
                    <p class="mb-4">The game was designed to provide a fresh take on the puzzle genre, offering both casual gamers and puzzle enthusiasts a new challenge that tests spatial reasoning and strategic thinking.</p>
                    
                    <p class="mb-4">With its minimalist design and addictive gameplay, Hextris creates the perfect balance between accessibility and challenge. The rules are simple to understand, but mastering the game requires practice and skill.</p>
                    
                    <blockquote class="bg-gray-50 p-4 italic border-l-4 border-apple-blue my-6">
                        "Hextris takes the classic block-matching concept and transforms it into something fresh and engaging with its hexagonal approach."
                    </blockquote>
                    
                    <p>Whether you're looking for a quick gaming session during a break or a challenging puzzle to test your skills, Hextris offers an engaging experience that's easy to learn but difficult to master.</p>
                </div>
            </div>
        </section>
        
        <!-- Features Section -->
        <section id="features" class="mb-16">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-apple-blue">Why Players Love Hextris</h2>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-3 text-apple-orange">Addictive Gameplay</h3>
                    <p>The simple yet challenging mechanics make Hextris incredibly addictive. Just one more game quickly turns into an hour of fun! The perfect balance of challenge and reward keeps you coming back.</p>
                </div>
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-3 text-apple-orange">Perfect for Quick Breaks</h3>
                    <p>Games can be as short or long as you want, making Hextris perfect for quick gaming sessions during work breaks or commutes. Need a mental reset? Play a round of Hextris!</p>
                </div>
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-3 text-apple-green">Brain Training</h3>
                    <p>The spatial reasoning and pattern recognition skills required in Hextris provide excellent mental exercise while you're having fun. It's like a gym workout for your brain!</p>
                </div>
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-semibold mb-3 text-apple-green">No Downloads Required</h3>
                    <p>Play instantly in your browser without having to download or install anything. Works on any device with a modern web browser - desktop, tablet, or phone!</p>
                </div>
            </div>
        </section>
        
        <!-- FAQ Section -->
        <section class="mb-16">
            <h2 class="text-2xl md:text-3xl font-bold mb-6 text-apple-blue">Frequently Asked Questions</h2>
            <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
                <div class="space-y-6">
                    <div>
                        <h3 class="text-xl font-semibold mb-2 text-apple-purple">Is Hextris free to play?</h3>
                        <p>Yes! Hextris is completely free to play online. No subscriptions, no in-app purchases, just pure puzzle fun.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2 text-apple-purple">Can I play Hextris on my mobile phone?</h3>
                        <p>Absolutely! Hextris is designed to work on all devices, including smartphones and tablets. The touch controls make it easy to play on mobile.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2 text-apple-purple">How do I get better at Hextris?</h3>
                        <p>Practice is key! Start by focusing on creating matches whenever possible, and learn to anticipate the impact of each move. Watch for opportunities to create chain reactions.</p>
                    </div>
                    <div>
                        <h3 class="text-xl font-semibold mb-2 text-apple-purple">Is there a way to save my high score?</h3>
                        <p>Currently, high scores are saved locally on your device. We're working on implementing online leaderboards in a future update!</p>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Call to Action -->
        <section class="mb-16 text-center">
            <div class="apple-gradient text-white p-8 rounded-xl shadow-md">
                <h2 class="text-2xl md:text-3xl font-bold mb-4">Ready to Challenge Yourself?</h2>
                <p class="mb-6 max-w-2xl mx-auto">Jump into the addictive world of Hextris and see how high you can score. It's free, fun, and waiting for you to play!</p>
                <a href="#play-now" class="bg-white text-apple-blue font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">Play Hextris Now</a>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
        <div class="container mx-auto px-4">
            <div class="grid md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 class="text-lg font-semibold mb-4">Hextris</h3>
                    <p class="text-gray-300">An addictive hexagonal puzzle game that challenges your spatial reasoning and quick thinking.</p>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="#play-now" class="text-gray-300 hover:text-white">Play Game</a></li>
                        <li><a href="#how-to-play" class="text-gray-300 hover:text-white">How to Play</a></li>
                        <li><a href="#about" class="text-gray-300 hover:text-white">About</a></li>
                        <li><a href="#features" class="text-gray-300 hover:text-white">Features</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-4">Connect</h3>
                    <p class="text-gray-300 mb-2">Share your high scores and feedback with us!</p>
                    <div class="flex space-x-4">
                        <a href="#" aria-label="Twitter" class="text-gray-300 hover:text-white">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook" class="text-gray-300 hover:text-white">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram" class="text-gray-300 hover:text-white">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-700 pt-6 text-center">
                <p class="mb-2">&copy; 2025 Hextris.online - All Rights Reserved</p>
                <p class="text-sm text-gray-400">Hextris is a browser-based puzzle game inspired by classic block-falling games with a hexagonal twist.</p>
            </div>
        </div>
    </footer>
    
    <!-- Simple JavaScript for smooth scrolling -->
    <script>
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body> 
</html>`;

  return (
    <div className="w-full h-full bg-[#222] flex items-center justify-center">
      <iframe
        srcDoc={hextrisHtml}
        className="w-full h-full border-0"
        title="Hextris"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
