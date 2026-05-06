"use client";

/**
 * Jogo de Aventura 2D — Agente LUPA (Mundos 1 e 2)
 *
 * Arquitetura:
 *   - Phaser 3 roda dentro de um <div> e cuida de física, animação e input.
 *   - React renderiza overlays (pergunta, feedback, game over, vitória) em
 *     cima do canvas, usando estado normal do React.
 *   - Comunicação Phaser → React: callbacks em uma ref (não causam re-render
 *     desnecessário e não ficam "velhos" entre renders).
 *   - Comunicação React → Phaser: ref para a cena atual (cenaRef).
 *   - Ao avançar de mundo, mundoAtual muda → useEffect destrói o jogo antigo
 *     e cria um novo com a cena do mundo seguinte.
 */

import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  XCircle,
  RotateCcw,
  Trophy,
  Heart,
  Swords,
  ArrowRight,
} from "lucide-react";
import type {
  EstadoOverlay,
  GameCallbacks,
  PerguntaAventura,
} from "@/lib/jogo/aventura/tipos";
import { PERGUNTAS_MUNDO1 } from "@/lib/jogo/aventura/perguntas";
import { PERGUNTAS_MUNDO2 } from "@/lib/jogo/aventura/perguntas_m2";

// ─── Componente principal ────────────────────────────────────────────────────

export default function JogoAventura() {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cenaRef = useRef<any>(null);
  const vidasInicialRef = useRef(3);
  const callbacksRef = useRef<GameCallbacks>({
    onMostrarPergunta: () => {},
    onGameOver: () => {},
    onVitoria: () => {},
    onAtualizarVidas: () => {},
    onAtualizarPontos: () => {},
  });

  const [overlay, setOverlay] = useState<EstadoOverlay>({ tipo: "nenhum" });
  const [vidas, setVidas] = useState(3);
  const [pontos, setPontos] = useState(0);
  const [iniciado, setIniciado] = useState(false);
  const [erroJogo, setErroJogo] = useState<string | null>(null);
  const [mundoAtual, setMundoAtual] = useState<1 | 2>(1);

  // Atualiza os callbacks sempre que o estado do React mudar.
  // Como usamos uma ref, a cena Phaser sempre chama a versão mais recente.
  callbacksRef.current = {
    onMostrarPergunta: (pergunta) =>
      setOverlay({ tipo: "pergunta", pergunta }),
    onGameOver: (p) => setOverlay({ tipo: "gameOver", pontos: p }),
    onVitoria: (p, corretas, total) =>
      setOverlay({ tipo: "vitoria", pontos: p, corretas, total }),
    onAtualizarVidas: setVidas,
    onAtualizarPontos: setPontos,
  };

  function aoResponder(correta: boolean, feedback: string) {
    setOverlay({ tipo: "feedback", correta, feedback });
    // Após 2,2 s de feedback, retoma o jogo
    setTimeout(() => {
      setOverlay({ tipo: "nenhum" });
      cenaRef.current?.resolverPergunta(correta);
    }, 2200);
  }

  function reiniciar() {
    setOverlay({ tipo: "nenhum" });
    vidasInicialRef.current = 3;
    setVidas(3);
    setPontos(0);
    cenaRef.current?.scene.restart();
  }

  // Chamado ao clicar "Avançar para Mundo 2" no painel de vitória do Mundo 1.
  // Mudar mundoAtual dispara o useEffect, que destrói o jogo atual e cria o novo.
  // As vidas são mantidas (não resetadas) ao avançar de mundo.
  function avancarMundo() {
    setOverlay({ tipo: "nenhum" });
    vidasInicialRef.current = vidas; // carrega as vidas atuais para o próximo mundo
    setPontos(0);
    setMundoAtual(2);
  }

  // Inicia (ou reinicia após avancar de mundo) o Phaser
  useEffect(() => {
    if (!iniciado || !containerRef.current) return;

    let jogo: import("phaser").Game | null = null;

    async function iniciarPhaser() {
      try {
        // O Phaser 3 exporta via UMD/CJS: em alguns bundlers o módulo em si
        // é o namespace (sem .default). Este fallback cobre os dois casos.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mod = await import("phaser") as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Phaser = (mod.default ?? mod) as typeof import("phaser");

        const banco = mundoAtual === 1 ? PERGUNTAS_MUNDO1 : PERGUNTAS_MUNDO2;

        // ── Cena unificada (Mundo 1 ou 2, conforme mundoAtual por closure) ───
        class CenaMundo extends Phaser.Scene {
          // Jogador
          private jogCorpo!: Phaser.GameObjects.Rectangle;
          private jogEmoji!: Phaser.GameObjects.Text;
          private jogSombra!: Phaser.GameObjects.Ellipse;
          private chaoRect!: Phaser.GameObjects.Rectangle;
          private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
          private teclasWASD!: {
            up: Phaser.Input.Keyboard.Key;
            left: Phaser.Input.Keyboard.Key;
            right: Phaser.Input.Keyboard.Key;
          };

          // Inimigo atual
          private iniCorpo: Phaser.GameObjects.Rectangle | null = null;
          private iniEmoji: Phaser.GameObjects.Text | null = null;
          private iniSombra: Phaser.GameObjects.Ellipse | null = null;

          // HUD
          private hudVidas: Phaser.GameObjects.Text[] = [];
          private hudPontos!: Phaser.GameObjects.Text;
          private hudProgresso!: Phaser.GameObjects.Text;

          // Estado
          private vidas = 3;
          private pontos = 0;
          private corretas = 0;
          private fila: PerguntaAventura[] = [];
          private filaIdx = 0;
          private totalPerguntas = 5;
          private velInimigo = 95;
          private jogoAtivo = true;
          private respondendo = false;

          constructor() {
            super({ key: `CenaMundo${mundoAtual}` });
            cenaRef.current = this;
          }

          create() {
            // Reseta estado — necessário porque Phaser reutiliza a instância no scene.restart()
            const N = 5;
            this.totalPerguntas = N;
            this.fila = embaralhar([...banco]).slice(0, N);
            this.filaIdx = 0;
            this.jogoAtivo = true;
            this.respondendo = false;
            this.vidas = vidasInicialRef.current;
            this.pontos = 0;
            this.corretas = 0;
            this.velInimigo = 95;
            this.iniCorpo = null;
            this.iniEmoji = null;
            this.iniSombra = null;
            this.hudVidas = [];

            this.physics.world.setBounds(0, 0, 800, 450);
            this.desenharFundo();
            this.criarChao();
            this.criarJogador();
            this.criarHUD();
            this.configurarControles();

            // Inimigo fica 18% mais rápido a cada 8 s (máx 220 px/s)
            this.time.addEvent({
              delay: 8000,
              callback: () => {
                if (this.jogoAtivo) this.velInimigo = Math.min(Math.round(this.velInimigo * 1.18), 220);
              },
              loop: true,
            });

            // Sincroniza HUDs com o estado inicial (importante ao avançar de mundo)
            this.atualizarHUD();
            callbacksRef.current.onAtualizarVidas(this.vidas);

            // Primeiro inimigo aparece após 1 s
            this.time.delayedCall(1000, () => this.proximoInimigo());
          }

          // ── Fundo: delega para M1 ou M2 ──────────────────────────────────────
          private desenharFundo() {
            if (mundoAtual === 1) {
              this.desenharFundoM1();
            } else {
              this.desenharFundoM2();
            }
          }

          // ── Fundo M1: cidade digital noturna (indigo) ─────────────────────────
          private desenharFundoM1() {
            const g = this.add.graphics();

            g.fillStyle(0x0f172a);
            g.fillRect(0, 0, 800, 450);

            // Estrelas
            g.fillStyle(0xffffff, 0.7);
            const estrelas = [
              [45, 30], [120, 55], [200, 20], [310, 45], [390, 15],
              [470, 60], [550, 25], [640, 50], [720, 18], [780, 42],
              [80, 90], [180, 110], [260, 75], [430, 100], [610, 85],
              [690, 110], [760, 70], [350, 130], [500, 115], [150, 140],
            ];
            for (const [x, y] of estrelas) {
              g.fillCircle(x, y, Math.random() < 0.4 ? 2 : 1);
            }

            // Partículas de dados (indigo)
            g.fillStyle(0x6366f1, 0.15);
            for (let i = 0; i < 18; i++) {
              const x = 20 + i * 44;
              const h = 15 + Math.floor(Math.random() * 40);
              g.fillRect(x, 50 + Math.floor(Math.random() * 200), 2, h);
            }

            // Prédios (silhueta)
            const predios = [
              { x: 0, w: 55, h: 130 }, { x: 65, w: 38, h: 85 },
              { x: 113, w: 65, h: 155 }, { x: 188, w: 48, h: 100 },
              { x: 246, w: 75, h: 175 }, { x: 331, w: 42, h: 90 },
              { x: 383, w: 60, h: 135 }, { x: 453, w: 52, h: 115 },
              { x: 515, w: 70, h: 160 }, { x: 595, w: 45, h: 95 },
              { x: 650, w: 58, h: 145 }, { x: 718, w: 42, h: 80 },
              { x: 770, w: 30, h: 110 },
            ];
            for (const p of predios) {
              const base = 400 - p.h;
              g.fillStyle(0x1e293b);
              g.fillRect(p.x, base, p.w, p.h);
              g.fillStyle(0xfbbf24, 0.55);
              for (let wy = base + 12; wy < 388; wy += 18) {
                for (let wx = p.x + 7; wx < p.x + p.w - 7; wx += 14) {
                  if (Math.random() > 0.35) g.fillRect(wx, wy, 7, 9);
                }
              }
            }

            g.fillStyle(0x334155);
            g.fillRect(0, 400, 800, 50);
            g.fillStyle(0x475569);
            g.fillRect(0, 400, 800, 3);
            g.fillStyle(0x3f4f62, 0.5);
            for (let cx = 0; cx < 800; cx += 60) g.fillRect(cx, 402, 40, 3);

            this.add
              .text(400, 14, "MUNDO 1  —  FAKE NEWS", {
                fontFamily: "Arial",
                fontSize: "13px",
                color: "#64748b",
                letterSpacing: 3,
              })
              .setOrigin(0.5, 0);
          }

          // ── Fundo M2: sala de arquivo / laboratório de evidências (verde) ─────
          private desenharFundoM2() {
            const g = this.add.graphics();

            // Céu verde-escuro (ambiente de pesquisa)
            g.fillStyle(0x0c1a12);
            g.fillRect(0, 0, 800, 450);

            // Grade de fundo (visual de laboratório)
            g.lineStyle(1, 0x10b981, 0.06);
            for (let x = 0; x <= 800; x += 50) {
              g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 400); g.closePath(); g.strokePath();
            }
            for (let y = 0; y <= 400; y += 50) {
              g.beginPath(); g.moveTo(0, y); g.lineTo(800, y); g.closePath(); g.strokePath();
            }

            // Partículas de dados (verde)
            g.fillStyle(0x10b981, 0.12);
            for (let i = 0; i < 16; i++) {
              const x = 25 + i * 48;
              const h = 12 + Math.floor(Math.random() * 35);
              g.fillRect(x, 40 + Math.floor(Math.random() * 180), 2, h);
            }

            // "Arquivos" ao fundo (em vez de prédios)
            const arquivos = [
              { x: 0, w: 60, h: 110 }, { x: 70, w: 40, h: 80 },
              { x: 120, w: 55, h: 140 }, { x: 185, w: 45, h: 95 },
              { x: 240, w: 70, h: 160 }, { x: 320, w: 50, h: 100 },
              { x: 380, w: 55, h: 125 }, { x: 445, w: 48, h: 105 },
              { x: 503, w: 65, h: 150 }, { x: 578, w: 42, h: 85 },
              { x: 630, w: 60, h: 135 }, { x: 700, w: 45, h: 75 },
              { x: 755, w: 45, h: 100 },
            ];
            for (const a of arquivos) {
              const base = 400 - a.h;
              g.fillStyle(0x0f2d1f);
              g.fillRect(a.x, base, a.w, a.h);
              // Divisórias de pasta
              g.fillStyle(0x10b981, 0.18);
              for (let fy = base + 15; fy < 388; fy += 20) {
                g.fillRect(a.x + 4, fy, a.w - 8, 2);
              }
              // Abas coloridas
              g.fillStyle(0x059669, 0.35);
              for (let fy = base + 10; fy < 388; fy += 20) {
                g.fillRect(a.x + 6, fy - 2, 18, 6);
              }
            }

            // Chão verde-escuro
            g.fillStyle(0x1a3a2a);
            g.fillRect(0, 400, 800, 50);
            g.fillStyle(0x2d5a40);
            g.fillRect(0, 400, 800, 3);
            g.fillStyle(0x1f4a30, 0.5);
            for (let cx = 0; cx < 800; cx += 60) g.fillRect(cx, 402, 40, 3);

            this.add
              .text(400, 14, "MUNDO 2  —  FONTES E EVIDÊNCIAS", {
                fontFamily: "Arial",
                fontSize: "13px",
                color: "#4ade80",
                letterSpacing: 2,
              })
              .setOrigin(0.5, 0);
          }

          // ── Chão com física estática ──────────────────────────────────────────
          private criarChao() {
            this.chaoRect = this.add.rectangle(400, 425, 800, 50, 0x000000, 0);
            this.physics.add.existing(this.chaoRect, true);
          }

          // ── Jogador ───────────────────────────────────────────────────────────
          private criarJogador() {
            this.jogSombra = this.add
              .ellipse(80, 402, 28, 8, 0x000000, 0.3)
              .setDepth(-1);

            this.jogCorpo = this.add.rectangle(80, 355, 30, 44, 0x000000, 0);
            this.physics.add.existing(this.jogCorpo);
            const b = this.jogCorpo.body as Phaser.Physics.Arcade.Body;
            b.setCollideWorldBounds(true);
            b.setMaxVelocityX(220);

            this.physics.add.collider(this.jogCorpo, this.chaoRect);

            this.jogEmoji = this.add
              .text(80, 355, "🔍", { fontSize: "34px" })
              .setOrigin(0.5, 0.5);
          }

          // ── HUD (vidas, pontos, progresso) ───────────────────────────────────
          private criarHUD() {
            const hudBg = this.add.graphics();
            hudBg.fillStyle(0x0f172a, 0.7);
            hudBg.fillRoundedRect(6, 6, 788, 40, 8);

            this.hudVidas = [];
            for (let i = 0; i < 3; i++) {
              this.hudVidas.push(
                this.add
                  .text(20 + i * 32, 14, "❤️", { fontSize: "22px" })
                  .setScrollFactor(0)
              );
            }

            this.hudPontos = this.add
              .text(400, 14, "0 pts", {
                fontFamily: "Arial",
                fontSize: "18px",
                color: "#e2e8f0",
                fontStyle: "bold",
              })
              .setOrigin(0.5, 0)
              .setScrollFactor(0);

            this.hudProgresso = this.add
              .text(760, 14, `0 / 5`, {
                fontFamily: "Arial",
                fontSize: "15px",
                color: "#94a3b8",
              })
              .setOrigin(1, 0)
              .setScrollFactor(0);
          }

          private atualizarHUD() {
            this.hudVidas.forEach((t, i) =>
              t.setText(i < this.vidas ? "❤️" : "🖤")
            );
            this.hudPontos.setText(`${this.pontos} pts`);
            this.hudProgresso.setText(`${this.corretas} / ${this.totalPerguntas}`);
          }

          // ── Controles ─────────────────────────────────────────────────────────
          private configurarControles() {
            this.cursors = this.input.keyboard!.createCursorKeys();
            this.teclasWASD = this.input.keyboard!.addKeys({
              up: Phaser.Input.Keyboard.KeyCodes.W,
              left: Phaser.Input.Keyboard.KeyCodes.A,
              right: Phaser.Input.Keyboard.KeyCodes.D,
            }) as typeof this.teclasWASD;
          }

          // ── Emoji do inimigo baseado no tipo de pergunta e no mundo ───────────
          private getMundoEmoji(tipo: string): string {
            const mapaM1: Record<string, string> = { bot: "🤖", manchete: "📰", corrente: "🔗" };
            const mapaM2: Record<string, string> = { conflito: "💰", citacao: "✂️", correlacao: "📊" };
            return (mundoAtual === 1 ? mapaM1 : mapaM2)[tipo] ?? "❓";
          }

          // ── Spawn de inimigo ──────────────────────────────────────────────────
          private proximoInimigo() {
            if (!this.jogoAtivo) return;

            const pergunta = this.fila[this.filaIdx];
            const emoji = this.getMundoEmoji(pergunta.tipoInimigo);

            this.iniSombra = this.add.ellipse(820, 402, 32, 10, 0x000000, 0.25);

            this.iniCorpo = this.add.rectangle(820, 358, 36, 44, 0x000000, 0);
            this.physics.add.existing(this.iniCorpo);
            const b = this.iniCorpo.body as Phaser.Physics.Arcade.Body;
            b.setAllowGravity(false);
            b.setCollideWorldBounds(false);

            this.iniEmoji = this.add
              .text(820, 358, emoji, { fontSize: "36px" })
              .setOrigin(0.5, 0.5);

            // Animação de entrada (pulso)
            this.tweens.add({
              targets: this.iniEmoji,
              scaleX: 1.15,
              scaleY: 1.15,
              yoyo: true,
              repeat: -1,
              duration: 600,
              ease: "Sine.easeInOut",
            });

            this.atualizarHUD();
          }

          // ── Loop principal ────────────────────────────────────────────────────
          update() {
            if (!this.jogoAtivo || this.respondendo) return;
            this.moverJogador();
            this.sincronizarVisuais();
            this.moverInimigo();
          }

          private moverJogador() {
            const b = this.jogCorpo.body as Phaser.Physics.Arcade.Body;
            const esq = this.cursors.left.isDown || this.teclasWASD.left.isDown;
            const dir = this.cursors.right.isDown || this.teclasWASD.right.isDown;
            const pular =
              (this.cursors.up.isDown ||
                this.cursors.space.isDown ||
                this.teclasWASD.up.isDown) &&
              b.blocked.down;

            if (esq) {
              b.setVelocityX(-200);
              this.jogEmoji.setScale(-1, 1);
            } else if (dir) {
              b.setVelocityX(200);
              this.jogEmoji.setScale(1, 1);
            } else {
              b.setVelocityX(0);
            }

            if (pular) b.setVelocityY(-420);
          }

          private sincronizarVisuais() {
            this.jogEmoji.setPosition(this.jogCorpo.x, this.jogCorpo.y - 2);
            this.jogSombra.setPosition(this.jogCorpo.x, 402);

            if (this.iniCorpo && this.iniEmoji) {
              this.iniEmoji.setPosition(this.iniCorpo.x, this.iniCorpo.y - 2);
              if (this.iniSombra) this.iniSombra.setPosition(this.iniCorpo.x, 402);
            }
          }

          private moverInimigo() {
            if (!this.iniCorpo || !this.iniEmoji) return;

            const b = this.iniCorpo.body as Phaser.Physics.Arcade.Body;
            const dx = this.jogCorpo.x - this.iniCorpo.x;
            const dy = this.jogCorpo.y - this.iniCorpo.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 55) {
              this.dispararPergunta();
              return;
            }

            const vel = this.velInimigo;
            b.setVelocityX(dx > 0 ? vel : -vel);
            b.setVelocityY(dy > 0 ? vel * 0.4 : -vel * 0.4);
            this.iniEmoji.setScale(dx > 0 ? -1 : 1, 1);
          }

          // ── Disparo de pergunta ───────────────────────────────────────────────
          private dispararPergunta() {
            if (this.respondendo) return;
            this.respondendo = true;
            this.physics.pause();

            this.tweens.add({
              targets: this.iniEmoji,
              alpha: 0,
              yoyo: true,
              repeat: 2,
              duration: 120,
              onComplete: () => {
                callbacksRef.current.onMostrarPergunta(this.fila[this.filaIdx]);
              },
            });
          }

          // ── Resultado da pergunta (chamado pelo React) ────────────────────────
          resolverPergunta(correta: boolean) {
            if (correta) {
              this.pontos += 100;
              this.corretas++;
              callbacksRef.current.onAtualizarPontos(this.pontos);

              this.tweens.add({
                targets: [this.iniEmoji, this.iniCorpo, this.iniSombra],
                scaleX: 2.5,
                scaleY: 2.5,
                alpha: 0,
                duration: 350,
                ease: "Power2",
                onComplete: () => {
                  this.iniEmoji?.destroy();
                  this.iniCorpo?.destroy();
                  this.iniSombra?.destroy();
                  this.iniEmoji = null;
                  this.iniCorpo = null;
                  this.iniSombra = null;

                  // Remove a pergunta respondida da fila
                  this.fila.splice(this.filaIdx, 1);
                  if (this.filaIdx >= this.fila.length) this.filaIdx = 0;
                  this.respondendo = false;

                  if (this.corretas >= this.totalPerguntas) {
                    // Vitória!
                    this.jogoAtivo = false;
                    callbacksRef.current.onVitoria(
                      this.pontos,
                      this.corretas,
                      this.totalPerguntas
                    );
                  } else {
                    this.physics.resume();
                    this.time.delayedCall(900, () => this.proximoInimigo());
                  }
                },
              });
            } else {
              // Resposta errada: perde vida, rotaciona fila, novo inimigo na sequência
              this.vidas--;
              callbacksRef.current.onAtualizarVidas(this.vidas);
              this.atualizarHUD();

              if (this.vidas <= 0) {
                this.jogoAtivo = false;
                callbacksRef.current.onGameOver(this.pontos);
                return;
              }

              // Move pergunta errada para o fim da fila (rodízio)
              const [errada] = this.fila.splice(this.filaIdx, 1);
              this.fila.push(errada);
              if (this.filaIdx >= this.fila.length) this.filaIdx = 0;

              // Inimigo recua e desaparece; próximo inimigo aparece com nova pergunta
              this.tweens.add({
                targets: [this.iniEmoji, this.iniSombra],
                x: "+=260",
                alpha: 0,
                duration: 380,
                ease: "Power1",
                onComplete: () => {
                  this.iniEmoji?.destroy();
                  this.iniCorpo?.destroy();
                  this.iniSombra?.destroy();
                  this.iniEmoji = null;
                  this.iniCorpo = null;
                  this.iniSombra = null;
                  this.respondendo = false;
                  this.physics.resume();
                  this.time.delayedCall(800, () => this.proximoInimigo());
                },
              });
            }
          }
        }

        // Cria o jogo Phaser dentro do <div>
        jogo = new Phaser.Game({
          type: Phaser.AUTO,
          width: 800,
          height: 450,
          parent: containerRef.current!,
          backgroundColor: mundoAtual === 1 ? "#0f172a" : "#0c1a12",
          scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
          },
          physics: {
            default: "arcade",
            arcade: { gravity: { x: 0, y: 650 }, debug: false },
          },
          scene: [CenaMundo],
          banner: false,
        });
      } catch (err) {
        setErroJogo(`Erro ao iniciar o jogo: ${String(err)}`);
      }
    }

    iniciarPhaser();

    return () => {
      jogo?.destroy(true);
      cenaRef.current = null;
    };
  }, [iniciado, mundoAtual]);

  // ─── Tela de início ─────────────────────────────────────────────────────────
  if (!iniciado) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center rounded-3xl border border-slate-200/60 bg-slate-900 p-10 text-center shadow-2xl">
        <div className="mb-4 text-6xl">🔍</div>
        <h2 className="text-3xl font-bold text-white">Mundo 1</h2>
        <p className="mt-1 text-lg font-semibold text-indigo-400">Fake News</p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
          Use as <strong className="text-slate-200">setas</strong> ou{" "}
          <strong className="text-slate-200">WASD</strong> para mover e{" "}
          <strong className="text-slate-200">Espaço</strong> para pular. Quando
          o inimigo te alcançar, responda corretamente para derrotá-lo!
        </p>
        <div className="mt-6 flex gap-6 text-3xl">
          <span title="Bot Espalhador">🤖</span>
          <span title="Manchete Falsa">📰</span>
          <span title="Corrente Viral">🔗</span>
        </div>
        <p className="mt-3 text-xs text-slate-500">3 inimigos · 3 vidas</p>
        <button
          onClick={() => setIniciado(true)}
          className="mt-8 flex items-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 px-8 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:brightness-110 active:scale-95"
        >
          <Swords className="h-5 w-5" />
          Iniciar Missão
        </button>
      </div>
    );
  }

  // ─── Jogo em andamento ───────────────────────────────────────────────────────
  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl">
      {/* HUD externo: vidas e pontos em React (acima do canvas) */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
        <div className="flex gap-1.5 text-xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i}>{i < vidas ? "❤️" : "🖤"}</span>
          ))}
        </div>
        <span className="text-sm font-bold text-slate-200">{pontos} pts</span>
      </div>

      {/* Canvas do Phaser: style inline garante que o browser calcula a altura
          ANTES do Phaser ler offsetWidth/offsetHeight do container */}
      <div
        ref={containerRef}
        id="phaser-aventura"
        className="w-full"
        style={{ aspectRatio: "800/450" }}
      />

      {erroJogo && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 p-6 text-center">
          <p className="text-sm text-rose-400">Erro ao iniciar o jogo: {erroJogo}</p>
        </div>
      )}

      {/* ── Overlay: Pergunta ── */}
      {overlay.tipo === "pergunta" && (
        <PainelPergunta pergunta={overlay.pergunta} aoResponder={aoResponder} />
      )}

      {/* ── Overlay: Feedback ── */}
      {overlay.tipo === "feedback" && (
        <PainelFeedback correta={overlay.correta} feedback={overlay.feedback} />
      )}

      {/* ── Overlay: Game Over ── */}
      {overlay.tipo === "gameOver" && (
        <PainelGameOver pontos={overlay.pontos} aoReiniciar={reiniciar} />
      )}

      {/* ── Overlay: Vitória ── */}
      {overlay.tipo === "vitoria" && (
        <PainelVitoria
          pontos={overlay.pontos}
          corretas={overlay.corretas}
          total={overlay.total}
          aoReiniciar={reiniciar}
          mundoAtual={mundoAtual}
          aoAvancarMundo={avancarMundo}
        />
      )}
    </div>
  );
}

// ─── Utilitário ──────────────────────────────────────────────────────────────

function embaralhar<T>(lista: T[]): T[] {
  for (let i = lista.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lista[i], lista[j]] = [lista[j], lista[i]];
  }
  return lista;
}

// ─── Sub-componentes de overlay ──────────────────────────────────────────────

// Mapa de emojis para todos os tipos de inimigo (Mundos 1 e 2)
const EMOJI_INIMIGO: Record<string, string> = {
  bot: "🤖",
  manchete: "📰",
  corrente: "🔗",
  conflito: "💰",
  citacao: "✂️",
  correlacao: "📊",
};

function PainelPergunta({
  pergunta,
  aoResponder,
}: {
  pergunta: PerguntaAventura;
  aoResponder: (correta: boolean, feedback: string) => void;
}) {
  const emoji = EMOJI_INIMIGO[pergunta.tipoInimigo] ?? "❓";
  const opcoes = embaralhar([...pergunta.opcoes]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-800 p-6 shadow-2xl">
        {/* Inimigo capturado */}
        <div className="mb-4 flex items-center gap-3">
          <span className="text-4xl">{emoji}</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Inimigo capturado: {pergunta.nomeInimigo}
            </p>
            <p className="mt-0.5 text-sm leading-snug text-slate-300">
              {pergunta.situacao}
            </p>
          </div>
        </div>

        {/* Enunciado */}
        <p className="mb-4 rounded-2xl bg-slate-700/60 p-4 text-base font-semibold text-white">
          {pergunta.enunciado}
        </p>

        {/* Opções */}
        <div className="space-y-3">
          {opcoes.map((op, i) => (
            <button
              key={i}
              onClick={() => aoResponder(op.correta, op.feedback)}
              className="w-full rounded-2xl border-2 border-slate-600 bg-slate-700 p-4 text-left text-sm text-slate-100 transition hover:border-indigo-500 hover:bg-indigo-900/40 active:scale-[0.98]"
            >
              <span className="mr-2 font-bold text-indigo-400">
                {i === 0 ? "A" : "B"}.
              </span>
              {op.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PainelFeedback({
  correta,
  feedback,
}: {
  correta: boolean;
  feedback: string;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/85 p-4 backdrop-blur-sm">
      <div
        className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
          correta
            ? "border-emerald-600 bg-emerald-900/60"
            : "border-rose-600 bg-rose-900/60"
        }`}
      >
        <div className="mb-3 flex items-center gap-3">
          {correta ? (
            <ShieldCheck className="h-9 w-9 text-emerald-400" />
          ) : (
            <XCircle className="h-9 w-9 text-rose-400" />
          )}
          <p
            className={`text-xl font-bold ${
              correta ? "text-emerald-300" : "text-rose-300"
            }`}
          >
            {correta ? "Correto! +100 pts" : "Incorreto! −1 vida"}
          </p>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">{feedback}</p>
      </div>
    </div>
  );
}

function PainelGameOver({
  pontos,
  aoReiniciar,
}: {
  pontos: number;
  aoReiniciar: () => void;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl border border-rose-700 bg-slate-800 p-8 text-center shadow-2xl">
        <div className="mb-2 text-5xl">💀</div>
        <h3 className="text-2xl font-bold text-rose-400">Missão Encerrada</h3>
        <p className="mt-2 text-slate-400">Suas vidas acabaram!</p>
        <p className="mt-4 text-3xl font-bold text-white">{pontos} pts</p>
        <button
          onClick={aoReiniciar}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 font-semibold text-white transition hover:bg-rose-500"
        >
          <RotateCcw className="h-4 w-4" />
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

function PainelVitoria({
  pontos,
  corretas,
  total,
  aoReiniciar,
  mundoAtual,
  aoAvancarMundo,
}: {
  pontos: number;
  corretas: number;
  total: number;
  aoReiniciar: () => void;
  mundoAtual: 1 | 2;
  aoAvancarMundo: () => void;
}) {
  const pct = Math.round((corretas / total) * 100);
  const medalha = pct === 100 ? "🥇" : pct >= 60 ? "🥈" : "🥉";
  const subtitulo =
    mundoAtual === 1 ? "Mundo 1 — Fake News" : "Mundo 2 — Fontes e Evidências";

  return (
    <div className="absolute inset-0 overflow-y-auto bg-slate-900/90 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-3xl border border-indigo-600 bg-slate-800 p-5 text-center shadow-2xl">
          <div className="mb-1 text-4xl">{medalha}</div>
          <h3 className="text-xl font-bold text-indigo-300">Missão Concluída!</h3>
          <p className="text-xs text-slate-400">{subtitulo}</p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-slate-700/60 p-2.5">
              <Trophy className="mx-auto mb-1 h-4 w-4 text-amber-400" />
              <p className="text-xl font-bold text-white">{pontos}</p>
              <p className="text-xs text-slate-400">pontos</p>
            </div>
            <div className="rounded-2xl bg-slate-700/60 p-2.5">
              <Heart className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
              <p className="text-xl font-bold text-white">{corretas}/{total}</p>
              <p className="text-xs text-slate-400">acertos</p>
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-indigo-900/40 p-2.5">
            <p className="text-xs text-slate-300">
              {pct === 100
                ? "🌟 Perfeito! Você é um expert em pensamento crítico."
                : pct >= 60
                ? "👍 Bom trabalho! Continue praticando para melhorar."
                : "💪 Continue treinando! A desinformação é traiçoeira."}
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {/* Botão de avanço: funcional no Mundo 1 → 2; "em breve" no Mundo 2 */}
            {mundoAtual === 1 ? (
              <button
                onClick={aoAvancarMundo}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 py-2.5 font-semibold text-white shadow-lg transition hover:brightness-110"
              >
                Avançar para Mundo 2
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="rounded-xl border border-emerald-600/40 bg-emerald-900/30 p-3">
                <p className="text-sm font-semibold text-emerald-300">🚧 Mundo 3 — Em breve!</p>
                <p className="mt-0.5 text-xs text-slate-400">
                  A próxima fase está sendo construída. Fique ligado!
                </p>
              </div>
            )}
            <button
              onClick={aoReiniciar}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-600 bg-slate-700 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-600"
            >
              <RotateCcw className="h-4 w-4" />
              Jogar novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
