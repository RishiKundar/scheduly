import React, { useEffect, useRef } from 'react';

export default function MatrixBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        
        // Array of drops. drop[i] = y position of the drop in column i
        const drops = [];
        const particles = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * height;
        }

        let mouse = { x: -1000, y: -1000, radius: 100 };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);
        
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        // We will maintain a list of active characters to handle the explosion physics
        class Particle {
            constructor(x, y, char) {
                this.baseX = x;
                this.baseY = y;
                this.x = x;
                this.y = y;
                this.char = char;
                this.vx = 0;
                this.vy = 0;
                this.alpha = 1;
                this.exploded = false;
            }

            update() {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius && !this.exploded) {
                    this.exploded = true;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.vx = -Math.cos(angle) * force * 15;
                    this.vy = -Math.sin(angle) * force * 15;
                }

                if (this.exploded) {
                    this.x += this.vx;
                    this.y += this.vy;
                    // Friction
                    this.vx *= 0.9;
                    this.vy *= 0.9;

                    // Spring back to base
                    this.x += (this.baseX - this.x) * 0.05;
                    this.y += (this.baseY - this.y) * 0.05;

                    // If close to base, reset
                    if (Math.abs(this.baseX - this.x) < 0.5 && Math.abs(this.baseY - this.y) < 0.5) {
                        this.x = this.baseX;
                        this.y = this.baseY;
                        this.exploded = false;
                    }
                } else {
                    this.baseY += 2; // fall speed
                    this.y = this.baseY;
                }

                if (this.baseY > height) {
                    this.baseY = 0;
                    this.y = 0;
                    this.char = chars.charAt(Math.floor(Math.random() * chars.length));
                }
            }

            draw(ctx) {
                ctx.fillStyle = '#10b981'; // emerald-500
                ctx.font = fontSize + 'px monospace';
                ctx.fillText(this.char, this.x, this.y);
            }
        }

        // Initialize particles
        for (let x = 0; x < columns; x++) {
            particles.push(new Particle(x * fontSize, drops[x], chars.charAt(Math.floor(Math.random() * chars.length))));
        }

        let animationFrameId;

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw(ctx);
                
                // Randomly change characters occasionally
                if (Math.random() > 0.98) {
                    particles[i].char = chars.charAt(Math.floor(Math.random() * chars.length));
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-950"
        />
    );
}
