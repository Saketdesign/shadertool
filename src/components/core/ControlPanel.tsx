
"use client"

import React from "react"
import { DitherConfig, DitherMethod, GeneratorType, Palette, presets } from "@/types"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Collapsible } from "@/components/ui/collapsible-section"
// Implementation: Assuming user has this or we simulate? 
// Actually, let's use a simple hex input or native color picker for now to avoid large dependencies.
// Or we can just use a list of preset palettes as before.

interface ControlPanelProps {
    config: DitherConfig
    setConfig: React.Dispatch<React.SetStateAction<DitherConfig>>
}

export function ControlPanel({ config, setConfig }: ControlPanelProps) {

    const updateConfig = (key: keyof DitherConfig, value: any) => {
        setConfig((prev) => ({ ...prev, [key]: value }))
    }

    const updateNestedConfig = (parent: keyof DitherConfig, key: string, value: any) => {
        setConfig((prev) => ({
            ...prev,
            [parent]: {
                ...(prev[parent] as any),
                [key]: value
            }
        }))
    }

    return (
        <div className="w-80 border-r border-white/10 bg-black/95 p-6 overflow-y-auto h-full text-zinc-100 scrollbar-thin scrollbar-thumb-zinc-800">
            <div className="mb-6">
                <h1 className="text-xl font-bold tracking-tight text-white mb-1">DITHER SHADE</h1>
                <p className="text-xs text-zinc-500">GENERATIVE PROCESSOR</p>
            </div>

            <div className="space-y-1">

                {/* SOURCE */}
                <Collapsible title="Source" defaultOpen={true}>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant={config.sourceType === 'image' ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => updateConfig('sourceType', 'image')}
                            >
                                Image
                            </Button>
                            <Button
                                variant={config.sourceType === 'generator' ? "default" : "outline"}
                                size="sm"
                                className="flex-1"
                                onClick={() => updateConfig('sourceType', 'generator')}
                            >
                                Generator
                            </Button>
                        </div>

                        {config.sourceType === 'generator' && (
                            <div className="space-y-3 pt-2">
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select
                                        value={config.generator.type}
                                        onValueChange={(val: string) => updateNestedConfig('generator', 'type', val)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="spiral">Spiral</SelectItem>
                                            <SelectItem value="noise">Noise</SelectItem>
                                            <SelectItem value="grid">Grid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between"><Label>Speed</Label> <span className="text-xs text-zinc-500">{config.generator.speed.toFixed(1)}</span></div>
                                    <Slider
                                        value={[config.generator.speed]}
                                        min={0} max={5} step={0.1}
                                        onValueChange={([val]: number[]) => updateNestedConfig('generator', 'speed', val)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><Label>Scale</Label> <span className="text-xs text-zinc-500">{config.generator.scale.toFixed(1)}</span></div>
                                    <Slider
                                        value={[config.generator.scale]}
                                        min={1} max={50} step={0.5}
                                        onValueChange={([val]: number[]) => updateNestedConfig('generator', 'scale', val)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><Label>Direction/Warp</Label> <span className="text-xs text-zinc-500">{config.generator.direction.toFixed(0)}</span></div>
                                    <Slider
                                        value={[config.generator.direction]}
                                        min={0} max={360} step={1}
                                        onValueChange={([val]: number[]) => updateNestedConfig('generator', 'direction', val)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Collapsible>

                {/* RENDER */}
                <Collapsible title="Render" defaultOpen={true}>
                    <div className="space-y-4">

                        <div className="space-y-2">
                            <Label>Dither Mode</Label>
                            <Select
                                value={config.ditherMethod}
                                onValueChange={(val: string) => updateConfig('ditherMethod', val)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ordered">Ordered (Bayer)</SelectItem>
                                    <SelectItem value="random">Random Noise</SelectItem>
                                    <SelectItem value="lines">Lines</SelectItem>
                                    <SelectItem value="halftone">Halftone</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Pixel Size</Label> <span className="text-xs text-zinc-500">{config.pixelScale}px</span></div>
                            <Slider
                                value={[config.pixelScale]}
                                min={1} max={32} step={1}
                                onValueChange={([val]: number[]) => updateConfig('pixelScale', val)}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Dither Amount</Label> <span className="text-xs text-zinc-500">{config.ditherAmount.toFixed(2)}</span></div>
                            <Slider
                                value={[config.ditherAmount]}
                                min={0} max={1} step={0.01}
                                onValueChange={([val]: number[]) => updateConfig('ditherAmount', val)}
                            />
                        </div>

                        {(config.ditherMethod === 'lines' || config.ditherMethod === 'halftone') && (
                            <div className="space-y-2 pt-2 border-t border-white/5">
                                <div className="flex justify-between"><Label>Line Frequency</Label> <span className="text-xs text-zinc-500">{config.render.lines.toFixed(1)}</span></div>
                                <Slider
                                    value={[config.render.lines]}
                                    min={10} max={200} step={1}
                                    onValueChange={([val]: number[]) => updateNestedConfig('render', 'lines', val)}
                                />
                            </div>
                        )}
                    </div>
                </Collapsible>

                {/* COLORS */}
                <Collapsible title="Colors">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Palette Preset</Label>
                            <Select
                                value={config.palette.name}
                                onValueChange={(val: string) => {
                                    const p = presets.find(pre => pre.name === val);
                                    if (p) updateConfig('palette', p);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {presets.map(p => (
                                        <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Brightness</Label> <span className="text-xs text-zinc-500">{config.brightness.toFixed(2)}</span></div>
                            <Slider
                                value={[config.brightness]}
                                min={-0.5} max={0.5} step={0.01}
                                onValueChange={([val]: number[]) => updateConfig('brightness', val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Contrast</Label> <span className="text-xs text-zinc-500">{config.contrast.toFixed(2)}</span></div>
                            <Slider
                                value={[config.contrast]}
                                min={0} max={2} step={0.01}
                                onValueChange={([val]: number[]) => updateConfig('contrast', val)}
                            />
                        </div>
                    </div>
                </Collapsible>

                {/* EFFECTS */}
                <Collapsible title="Effects">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Vignette</Label> <span className="text-xs text-zinc-500">{config.effects.vignette.toFixed(2)}</span></div>
                            <Slider
                                value={[config.effects.vignette]}
                                min={0} max={1} step={0.01}
                                onValueChange={([val]: number[]) => updateNestedConfig('effects', 'vignette', val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Glow (Bloom)</Label> <span className="text-xs text-zinc-500">{config.effects.glow.toFixed(2)}</span></div>
                            <Slider
                                value={[config.effects.glow]}
                                min={0} max={2} step={0.01}
                                onValueChange={([val]: number[]) => updateNestedConfig('effects', 'glow', val)}
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between"><Label>Warp (Distortion)</Label> <span className="text-xs text-zinc-500">{config.effects.warp.toFixed(2)}</span></div>
                            <Slider
                                value={[config.effects.warp]}
                                min={0} max={5} step={0.1}
                                onValueChange={([val]: number[]) => updateNestedConfig('effects', 'warp', val)}
                            />
                        </div>
                        <div className="pt-2 flex items-center justify-between">
                            <Label>Mouse Interaction</Label>
                            <Switch
                                checked={config.effects.mouse > 0}
                                onCheckedChange={(checked: boolean) => updateNestedConfig('effects', 'mouse', checked ? 1.0 : 0.0)}
                            />
                        </div>
                    </div>
                </Collapsible>

            </div>
        </div>
    )
}
