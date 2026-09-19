# CONTINUUM
## Locked End-to-End Agent Specification
### Mathematical Living Particle Universe

**Document status:** LOCKED PRODUCT SPECIFICATION  
**Project name:** Continuum  
**Artifact:** `CONTINUUM_AGENT.md`  
**Purpose:** Authoritative implementation contract for the Continuum web application.

---

# 0. LOCKED DIRECTIVE

Continuum is a fullscreen, interactive mathematical living-particle universe.

It is not:
- A normal particle wallpaper.
- A static mathematical illustration.
- A conventional game.
- A simple physics demo.
- A dashboard filled with permanent controls.
- A fixed library limited to 200 shapes.
- A collection of unrelated visual effects.

The implementation must preserve these principles:

1. Particles are persistent simulation entities.
2. Mathematical rules govern particle and shape behavior.
3. Structures can emerge, transform, react, and self-heal.
4. The universe should feel alive through continuous motion and coherent reactions.
5. The user can observe, configure, randomize, and fire the Canon.
6. The four primary controls are independent.
7. Hand mode prevents particle effects while still allowing Canon activation.
8. Colored particles are disabled by default and enabled through Pencil.
9. The system must support procedural expansion beyond a fixed shape count.
10. The UI stays minimal until the user opens a mode or menu.
11. System/browser theme is the default theme source.
12. No feature may be removed merely because the first implementation is easier.

Technical limitations must be handled honestly through scalable architecture, virtualized worlds, procedural generation, level of detail, and bounded active simulation. The product may feel infinite, but physical hardware and browser resources remain finite.

---

# 1. PRODUCT IDENTITY

## 1.1 Name

Primary name: **Continuum**

Possible internal identifiers:
- `continuum-web`
- `continuum-engine`
- `continuum-universe`
- `continuum-agent`

Do not rename the product casually. Any future rename must be an explicit product decision.

## 1.2 Visual identity

The visual language is based on the approved reference sketch:

- Deep black or near-black space-like canvas.
- Fine particle fields.
- Mathematical grids and wireframes.
- Glowing but restrained particle clusters.
- Orbital systems.
- Fractals and geometric diagrams.
- Fine equations and constants.
- Subtle blue, white, violet, and warm accent light when applicable.
- Minimal circular controls.
- Floating translucent hints.
- Elegant technical typography.
- Large empty areas where appropriate.
- No cluttered conventional app chrome.

The sketch is a visual direction reference, not a literal requirement to reproduce every generated pixel. The implementation should preserve its composition, atmosphere, information density, and interaction philosophy.

## 1.3 Core phrase

Suggested visual copy:

> A universe that calculates itself.

Secondary language:
- Math · Motion · Life · Infinite
- Explore · Create · Observe · Disrupt · Reimagine

Avoid excessive slogans, marketing cards, onboarding walls, or unnecessary explanatory UI.

---

# 2. NON-NEGOTIABLE PRODUCT REQUIREMENTS

## 2.1 Canvas

- Fullscreen by default.
- Canvas occupies the entire viewport.
- Background grid loads before or alongside the particle initialization.
- Initial particles appear as a coordinated initial reveal, not a slow one-by-one loading list.
- Particles immediately enter continuous simulation.
- Camera supports zoom and pan.
- Canvas supports touch and pointer interaction.
- Canvas supports a virtual or infinite-feeling coordinate space.
- The application remains usable with the primary controls collapsed to their icons.

## 2.2 Primary controls

Exactly four persistent primary controls:

1. Hand
2. Pencil
3. Random
4. Canon

Default placement:
- Preferred: top-right floating group.
- Alternative: bottom-center floating group.
- Placement must be selected as a responsive layout decision, not rendered in both locations simultaneously.
- Controls must avoid browser safe areas, system gesture zones, and important particle content when possible.

Controls are independent:
- Activating Hand does not deactivate Canon.
- Opening Pencil does not automatically reset Random.
- Random does not implicitly disable Hand or Canon.
- Canon remains fireable in Hand mode.
- Hand mode changes the effect permissions of Canon, not Canon activation.
- Multiple menus may be technically open only if the interaction model explicitly supports it. Avoid accidental menu stacking.

## 2.3 Theme

- Follow browser/system theme by default.
- Use CSS custom properties for all colors.
- Support light and dark rendering without hard-coded assumptions.
- Dark mode is the primary visual reference.
- Theme changes must not reset simulation state.
- Particle contrast must remain accessible in both themes.
- The user should not need to configure a theme before using the universe.

## 2.4 Colored particles

Default: OFF.

Location:
- Pencil menu.
- Particle appearance or visual behavior section.

When OFF:
- Use monochrome or neutral theme-derived particles.
- Do not inject random color by default.
- Effects may still use controlled luminance, opacity, glow, or neutral intensity.

When ON:
- Support color sources such as:
  - Velocity.
  - Energy.
  - Shape membership.
  - Dimension.
  - Mathematical function output.
  - User-selected gradient.
  - Procedural palette.
  - Random palette.
- Color transitions must be smooth.
- Color must not change simulation semantics unless a specific rule explicitly maps color to a physical or mathematical variable.
- Color generation must be deterministic when a seed is fixed.

---

# 3. TECHNOLOGY STACK

## 3.1 Language: TypeScript

Why:
- Strong types for particle state, mathematical rules, shape schemas, interaction events, and presets.
- Better refactoring safety than an untyped JavaScript-only architecture.
- Shared types between renderer, simulation, UI, and storage.
- Good ecosystem support for browser applications.
- Suitable for large modular systems with many independently authored behaviors.

Use strict TypeScript configuration:
- `strict: true`
- Avoid `any` except at controlled external boundaries.
- Use discriminated unions for rule and interaction types.
- Validate runtime-loaded data at boundaries.

## 3.2 Markup: HTML5

Why:
- Native browser foundation.
- Semantic structure for overlays, menus, buttons, labels, and accessible controls.
- Canvas is appropriate for high-volume visual rendering.
- HTML remains responsible for interaction and accessibility instead of drawing every control into the GPU canvas.

## 3.3 UI: React

Why:
- Component-based organization for menus, hint overlays, controls, preset browsers, and configuration panels.
- Clear separation between UI state and simulation state.
- Mature ecosystem and development tooling.
- Supports incremental construction without forcing the particle engine to become React-managed state.

Rule:
- Do not store every particle in React state.
- React renders UI and configuration state.
- The simulation engine owns high-frequency particle state.

## 3.4 Build tool: Vite

Why:
- Fast local development.
- Straightforward TypeScript and React integration.
- Efficient production bundling.
- Simple deployment to static hosting or an edge-backed frontend.
- Avoid unnecessary framework complexity for a client-heavy simulation.

## 3.5 Renderer: WebGPU with WebGL2 fallback

Why WebGPU:
- Designed for modern GPU workloads.
- Compute shaders can support future particle processing.
- Better long-term path for large particle fields and advanced effects.
- Explicit GPU resource management.

Why WebGL2 fallback:
- Browser and device compatibility.
- A usable renderer must not depend on WebGPU being available everywhere.
- Provides a practical initial rendering path while WebGPU support matures.

Renderer rules:
- Detect capability at startup.
- Select WebGPU when supported and stable.
- Fall back to WebGL2.
- Show a non-blocking capability notice only when relevant.
- Do not silently pretend that all renderers have identical performance.

## 3.6 Math library: Custom math modules + mathjs

Why custom modules:
- Core simulation math must be predictable and optimized.
- Domain-specific behavior needs explicit semantics.
- Avoid making the entire engine dependent on a symbolic parser.
- Easier testing of vectors, geometry, fields, projections, and constraints.

Why mathjs:
- Useful for optional user-entered expressions and symbolic/numeric operations.
- Provides a controlled foundation for configurable mathematical functions.
- Must run inside a restricted expression environment.
- Never evaluate arbitrary JavaScript from user expressions.

Expression safety:
- Allowlisted functions and constants.
- Resource limits.
- Execution time limits where practical.
- No filesystem, network, DOM, or arbitrary code access.
- Validate and compile expressions before activation.
- Provide clear error messages without crashing the simulation.

## 3.7 Vector operations: gl-matrix

Why:
- Efficient vector, matrix, quaternion, and transformation operations.
- Useful for projections, rotations, dimensions, and camera transforms.
- Mature and lightweight.
- Reduces repeated custom low-level math code.

## 3.8 Physics

Primary approach:
- Custom force and constraint system.

Optional integration:
- Rapier only when collision or rigid-body behavior genuinely requires it.

Why custom forces first:
- Continuum is not primarily a conventional rigid-body game.
- Most behavior comes from fields, attractors, routing, shape constraints, and mathematical transformations.
- A custom system provides better control over composition and deterministic behavior.
- Avoid imposing rigid-body assumptions on every preset.

Rapier must not become a mandatory dependency for all particles.

## 3.9 Animation

Simulation:
- `requestAnimationFrame` for rendering.
- Fixed simulation timestep.
- Interpolation between simulation states where required.
- Stable integration and frame-rate independence.

UI:
- Motion for menus, hints, overlays, and interface transitions.

Why:
- Simulation motion must be governed by state and physics-like integration.
- UI transitions benefit from a dedicated animation library.
- Do not use UI easing as a substitute for correct particle simulation.

## 3.10 Icons: Lucide

Primary icons:
- Hand: `hand`
- Pencil: `pencil`
- Random: `shuffle`
- Canon: `crosshair`
- Close: `x`
- Hint: `lightbulb`
- Reset/restore: `rotate-ccw`
- Zoom: `zoom-in`, `zoom-out`
- Settings: `sliders-horizontal`
- Shapes: `shapes`
- Mathematics: `function-square` or a supported equivalent
- Physics: `atom`
- Dimensions: `layers`
- Routing: `route`
- Healing: `heart-pulse`

Why Lucide:
- Consistent outline language.
- Lightweight SVG icon system.
- Good control over stroke width, size, and color.
- Suitable for minimal technical interfaces.
- Avoid mixing unrelated icon styles.

If an exact icon is unavailable, choose the closest semantically accurate Lucide icon. Do not use random emoji as primary controls.

## 3.11 State: Zustand

Why:
- Lightweight global UI state.
- Useful for menu visibility, selected preset, mode flags, configuration drafts, and preferences.
- Avoids unnecessary prop drilling.
- Keeps simulation state separate from UI state.

Important:
- High-frequency particle positions must not be pushed through Zustand on every frame.
- Use engine-owned buffers or typed arrays.
- UI receives snapshots, derived statistics, or explicitly requested state.

## 3.12 Storage: IndexedDB

Why:
- Browser-native persistent storage.
- Suitable for presets, saved universes, preferences, seeds, and user-authored rules.
- More appropriate than localStorage for larger structured data.

Store:
- User preferences.
- Theme preference when explicitly changed.
- Colored-particle preference.
- Saved presets.
- Seeds.
- Validated configuration schemas.
- Recent universe state when enabled.

Never store executable arbitrary code as trusted configuration.

## 3.13 Testing: Vitest

Test:
- Vector and geometry functions.
- Shape generators.
- Rule composition.
- Self-healing logic.
- Camera transformations.
- Canon firing models.
- Preset schema validation.
- Deterministic seeded random generation.
- Hand mode permission rules.
- Expression safety.
- Performance-sensitive pure functions where practical.

---

# 4. SOURCE ARCHITECTURE

Suggested structure:

```text
continuum/
├── public/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes/
│   │   └── providers/
│   │
│   ├── ui/
│   │   ├── canvas/
│   │   ├── controls/
│   │   ├── pencil/
│   │   ├── canon/
│   │   ├── hints/
│   │   ├── presets/
│   │   └── common/
│   │
│   ├── engine/
│   │   ├── simulation/
│   │   ├── particles/
│   │   ├── shapes/
│   │   ├── forces/
│   │   ├── healing/
│   │   ├── interactions/
│   │   ├── dimensions/
│   │   ├── projections/
│   │   └── lifecycle/
│   │
│   ├── math/
│   │   ├── constants/
│   │   ├── geometry/
│   │   ├── trigonometry/
│   │   ├── vectors/
│   │   ├── fractals/
│   │   ├── fibonacci/
│   │   ├── fields/
│   │   ├── relativity/
│   │   ├── quantum/
│   │   └── expressions/
│   │
│   ├── renderer/
│   │   ├── webgpu/
│   │   ├── webgl2/
│   │   ├── shaders/
│   │   ├── buffers/
│   │   └── postprocessing/
│   │
│   ├── presets/
│   │   ├── solar-system/
│   │   ├── walking-man/
│   │   ├── river/
│   │   ├── spacetime/
│   │   ├── black-hole/
│   │   ├── endless-hotel/
│   │   └── registry/
│   │
│   ├── state/
│   ├── storage/
│   ├── schemas/
│   ├── accessibility/
│   ├── performance/
│   └── tests/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── vitest.config.ts
└── CONTINUUM_AGENT.md
```

The directory structure is a starting contract. Modules may be split further as complexity increases, but simulation, rendering, UI, and data validation must remain separable.

---

# 5. RUNTIME LAYERS

## 5.1 Layer order

The visual stack should follow this order:

1. Base page and theme.
2. Background.
3. Mathematical grid.
4. Universe projection.
5. Particle and shape rendering.
6. Canon effects and simulation visual effects.
7. Camera and interaction indicators.
8. Hint overlays.
9. Primary controls.
10. Open menus and modal configuration panels.
11. Accessibility announcements or status regions.

The actual rendering pipeline may combine layers for performance, but their interaction and visual priority must remain clear.

## 5.2 Separation of concerns

Simulation:
- Owns particle state.
- Owns rules and forces.
- Owns shape membership.
- Owns healing.
- Owns Canon effects on the world.
- Owns time evolution.

Renderer:
- Reads simulation output.
- Projects state.
- Draws particles, lines, grids, and effects.
- Does not invent simulation state.

UI:
- Owns controls and menus.
- Sends explicit commands to the engine.
- Displays configuration and status.
- Does not update every particle through React.

Camera:
- Owns viewport transform.
- Owns zoom and pan.
- Can operate independently of particle effects.
- Must support Hand mode.

---

# 6. PARTICLE ENTITY MODEL

A particle is a persistent simulation entity.

Conceptual state:

```ts
type ParticleState = {
  id: number
  position: Vector
  previousPosition: Vector
  velocity: Vector
  acceleration: Vector
  size: number
  width: number
  length: number
  density: number
  mass: number
  orientation: QuaternionOrAngle
  angularVelocity: number
  energy: number
  age: number
  alive: boolean
  shapeMembership: ShapeMembership[]
  neighbors: NeighborReference[]
  dimensionState: DimensionState
  healingState: HealingState
  interactionState: InteractionState
  visualState: VisualState
}
```

This is a conceptual contract. The final representation may use typed arrays or packed GPU buffers.

## 6.1 Persistence

Default particle behavior:
- Particles do not die due to ordinary animation completion.
- Particles do not disappear because a blast occurred.
- Particles may be displaced, fragmented, hidden by projection, merged into structures, or procedurally regenerated according to an explicit model.
- Any removal must be caused by a documented rule, resource policy, or explicit user action.
- The default universe should feel persistent and continuously populated.

The system must distinguish:
- Logical existence.
- Active simulation.
- Visible rendering.
- Projection visibility.
- Dormant or streamed state.

## 6.2 Position and movement

Each particle may be affected by:
- Local forces.
- Global fields.
- Shape constraints.
- Neighbor relationships.
- Routing paths.
- Mathematical functions.
- Preset-specific rules.
- Canon effects.
- Healing forces.
- Dimension transformations.

Use continuous updates. Avoid teleporting particles unless the active rule explicitly defines a discontinuity.

## 6.3 Width and length

Width and length may affect:
- Visual geometry.
- Collision or influence area.
- Distance calculations.
- Shape fitting.
- Density estimation.
- Alignment constraints.
- Routing behavior.

Do not assume width and length are purely cosmetic.

## 6.4 Density

Density is a simulation and presentation concept.

Support:
- Local density.
- Target density.
- Global density.
- Density gradients.
- Density-driven attraction or repulsion.
- Density-dependent rendering level of detail.

Avoid spawning unlimited active particles without resource controls. Use procedural density, instancing, streaming, or level-of-detail when the requested virtual density exceeds device capacity.

---

# 7. SHAPE SYSTEM

## 7.1 Shape contract

Each shape should define or reference:

```ts
type ShapeDefinition = {
  id: string
  name: string
  category: string
  version: number
  generator: ShapeGenerator
  boundaryModel: BoundaryModel
  forceModel: ForceModel
  routingModel: RoutingModel
  spinModel: SpinModel
  densityModel: DensityModel
  healingModel: HealingModel
  projectionModel?: ProjectionModel
  parameters: ParameterSchema
  capabilities: ShapeCapabilities
}
```

## 7.2 Shape categories

Support:
- Basic geometry.
- Parametric curves.
- Surfaces and volumes.
- Recursive structures.
- Fractals.
- Biological forms.
- Cosmic forms.
- Fluid forms.
- Architectural forms.
- Mathematical diagrams.
- Higher-dimensional projections.
- User-defined procedural forms.
- Composed multi-shape structures.

## 7.3 Shape count

The system must not be limited to 200 shapes.

200+ is an initial curated library target, not a hard ceiling.

The long-term model must support:
- Parametric variation.
- Procedural generation.
- Recursive generation.
- Shape combinations.
- Rule-generated structures.
- User-authored definitions.
- Preset-specific shape variants.
- Infinite or extremely large variation spaces where mathematically meaningful.

## 7.4 Shape transition

When a new shape is accepted:
1. Capture the current state.
2. Generate the target structure.
3. Establish particle-to-target correspondence.
4. Compute a transition field or mapping.
5. Move particles continuously.
6. Preserve velocity where appropriate.
7. Apply constraints gradually.
8. Enable the target rule set.
9. Reconcile healing state.
10. Complete only when the target structure reaches its configured acceptance condition.

Do not simply delete all particles and respawn them at final coordinates unless the selected mode explicitly requests a hard reset.

---

# 8. SELF-HEALING SYSTEM

Self-healing is available for both particles and shapes.

## 8.1 Controls

Pencil menu must provide:
- Global self-healing toggle.
- Particle healing toggle.
- Shape healing toggle.
- Healing strength.
- Healing speed.
- Healing threshold.
- Recovery delay.
- Neighbor dependence.
- Structural priority.
- Whether healing restores position, connections, density, or shape geometry.

Default:
- Enabled unless the user changes it.
- Changes must be explicit and persistent for the current universe.
- Disabling healing must not automatically delete particles.

## 8.2 Healing model

Possible mechanisms:
- Attractor-based restoration.
- Constraint reconstruction.
- Neighbor-assisted recovery.
- Density rebalancing.
- Shape correspondence.
- Graph reconnection.
- Procedural regeneration.
- Energy-dependent recovery.
- Local-to-global structural repair.

The engine must define what constitutes damage:
- Displacement.
- Broken alignment.
- Missing connection.
- Density hole.
- Boundary distortion.
- Shape deviation.
- Excessive energy or velocity.
- Particle separation.

## 8.3 Healing philosophy

Healing must look like the system is reorganizing itself, not like a hard reset.

Required visual qualities:
- Smooth recovery.
- Local reactions before global restoration where appropriate.
- No universal synchronized snapping.
- Recovery speed depends on selected model.
- Structures may temporarily remain damaged if the model requires time or sufficient resources.
- Healing can fail or produce a different stable configuration if the active rules allow it.

---

# 9. MATHEMATICAL SYSTEM

The math system is modular and must distinguish different semantic roles.

## 9.1 Constants and number systems

Support visual or behavioral use of:
- 0.
- 1, 2, 3, 4 and other integer sequences.
- Binary.
- π.
- e.
- √2.
- i.
- Golden ratio φ.
- Other user-defined constants.
- Large-number representations such as Graham's number.
- Omega and hyperoperations where a meaningful visualization or abstraction is defined.

Large and abstract mathematical objects must not be represented as literal finite numeric values when that is impossible. Use symbolic, recursive, ordinal-like, or procedural representations with explicit labels.

## 9.2 Geometry

Support:
- Points.
- Lines.
- Circles.
- Polygons.
- Curves.
- Surfaces.
- Volumes.
- Angles.
- Adjacent/opposite/hypotenuse relationships.
- Distance fields.
- Boundaries.
- Symmetry.
- Scale.
- Parallax.
- Transformations.
- Projections.

## 9.3 Trigonometry

Support:
- Sine.
- Cosine.
- Tangent.
- Phase.
- Frequency.
- Amplitude.
- Angular velocity.
- Wave fields.
- Rotations.
- Oscillation.
- Lissajous-style structures.

Document angle units per rule. Internal trigonometric calculations should use radians unless a rule explicitly defines another unit.

## 9.4 Patterns

Support:
- Fibonacci.
- Recursive sequences.
- Fractals.
- Self-similarity.
- Cellular patterns.
- Lattice patterns.
- Spiral arrangements.
- Symmetry breaking.
- Noise and flow fields.
- Procedural growth.

## 9.5 Physics and fields

Support configurable models for:
- Gravity-like attraction.
- Repulsion.
- Momentum.
- Damping.
- Spring-like constraints.
- Flow.
- Turbulence.
- Collision or proximity response.
- Electromagnetic-like fields.
- Wave propagation.
- Energy transfer.
- Field falloff.

These are simulation models. Do not claim that every model is a physically accurate representation of nature.

## 9.6 Higher dimensions

Support representation and projection of 1D through 11D structures where the chosen mathematical model permits it.

The screen cannot directly display arbitrary higher-dimensional space. Use:
- Projection.
- Cross-section.
- Parameter slicing.
- Rotations.
- Coordinate selection.
- Manifold sampling.
- Color or opacity as an optional extra variable.

The UI must identify when a visualization is a projection or abstraction.

## 9.7 Advanced theories

Possible modules:
- String-inspired geometry.
- M-theory-inspired dimensional structures.
- Supergravity-inspired fields.
- Maxwell-equation-inspired electromagnetic field visualization.
- Schrödinger-equation-inspired wavefunction visualization.
- Spacetime curvature-inspired grids.
- Coastline/fractal scaling.
- Parallax and scale-dependent observation.

Each module requires an explicit model, assumptions, parameters, and limitations. Avoid presenting a visual analogy as a complete scientific simulation.

---

# 10. INITIALIZATION AND LOADING

Required sequence:

1. Resolve theme and viewport.
2. Detect renderer capabilities.
3. Initialize canvas and camera.
4. Load the grid.
5. Load selected preset or generated universe configuration.
6. Validate configuration.
7. Allocate particle and shape buffers.
8. Generate initial particle positions and relationships.
9. Prepare the initial rendering state.
10. Reveal the particle system in a coordinated appearance.
11. Start the simulation clock.
12. Enable interaction.

Initial particles should appear together as an initial structure. A reveal animation may be used, but it must not make the experience feel like a list of particles loading individually.

Loading failure:
- Preserve a usable background.
- Show a concise, dismissible error or recovery hint.
- Do not leave the interface in a falsely active state.
- Offer retry or fallback where practical.

---

# 11. TOUCH, SWIPE, AND INTERACTION PHILOSOPHY

## 11.1 General rule

Touch is meaningful. It should not behave like a generic click-only interface.

The system must distinguish:
- Camera gestures.
- Particle interaction.
- Canon aiming.
- Canon firing.
- Menu interaction.
- Hint dismissal.
- Shape selection.
- Multi-touch zoom.

Use pointer events where practical, with touch and mouse support.

## 11.2 Default particle interaction

When Hand mode is disabled:
- Touching a particle or particle region may trigger a blast-like reaction.
- Swiping across the particle field may continuously trigger interactions according to the configured swipe model.
- Reactions should be spatially coherent.
- Repeated interaction should not create uncontrolled event storms.
- The system should apply force or impulse through the simulation rather than manually teleporting particles.
- The user must be able to observe propagation, displacement, and recovery.

The exact blast model is configurable and may vary by preset.

## 11.3 Hand mode

Hand mode is an observation and navigation mode.

When enabled:
- User can pan.
- User can zoom.
- User can inspect higher-dimensional projections.
- User can see particles and structures.
- Direct particle touch and swipe effects are disabled.
- Swipe moves the graph/camera, not the particles.
- Particle behavior continues independently.
- User cannot directly command particles to select a shape or route.
- User cannot directly manipulate particle positions through touch.

Canon behavior in Hand mode:
- Canon can be activated.
- Canon can be aimed and fired.
- Canon firing is allowed.
- Particle effects from Canon are disabled.
- Non-particle visual firing effects may remain visible if configured.
- Hand mode remains enabled after firing.
- No hidden state reset should occur.

Hand mode must not freeze the universe unless a separate pause function is explicitly introduced.

## 11.4 Gesture arbitration

The input system must resolve gestures based on active context:

Priority:
1. UI controls and menus.
2. Hint close buttons.
3. Canon aiming/firing context.
4. Camera navigation in Hand mode.
5. Particle interaction when Hand mode is disabled.
6. Background gesture fallback.

Do not let a gesture trigger both camera panning and a particle blast in the same pointer sequence unless the behavior is explicitly designed and communicated.

## 11.5 Zoom

- Pinch zoom on touch.
- Wheel or trackpad zoom on desktop.
- Zoom centered around the pointer or gesture midpoint where possible.
- Apply minimum and maximum practical zoom bounds.
- Support virtual coordinate scaling beyond the visible canvas.
- Avoid numerical instability at extreme zoom values.
- Preserve camera state when menus open and close.

---

# 12. CANON SYSTEM

## 12.1 Canon control

The Canon is a separate primary control and interaction subsystem.

Icon:
- `crosshair`

The Canon must be usable independently of Hand, Pencil, and Random.

## 12.2 Canon menu

Sections:
- Activation.
- Aiming.
- Firing method.
- Power.
- Range.
- Falloff.
- Spread.
- Cooldown.
- Rate of fire.
- Direction.
- Projectile or impulse model.
- Particle interaction.
- Shape interaction.
- Visual effects.
- Preset-specific behavior.

## 12.3 Firing methods

Initial methods:
- Single shot.
- Rapid fire.
- Burst.
- Beam.
- Wave pulse.
- Spread.
- Orbital shot.
- Gravity-like shot.
- Radial impulse.
- Directed field.
- Chain reaction.
- Pattern firing.

Additional methods may be added through the extensible firing registry.

## 12.4 Canon firing lifecycle

1. Open Canon mode.
2. Render Canon state and targeting feedback.
3. Resolve aim position and direction.
4. Validate firing permissions.
5. Apply cooldown and resource checks.
6. Spawn or apply the selected firing model.
7. Propagate effects through the simulation.
8. Render visual effects.
9. Update affected particle and shape states.
10. Trigger healing or structural response if enabled.
11. Complete the firing event without blocking the UI.

## 12.5 Hand mode Canon rule

When Hand mode is enabled:
- Firing is allowed.
- Particle effects are suppressed.
- The firing action may produce visual-only feedback.
- The simulation must not receive a particle-displacement command from that firing event.
- Canon cooldown behavior may remain active if the user fires repeatedly.
- The UI must not falsely report particle damage or particle displacement.

---

# 13. RANDOM MODE

Random mode generates a new universe configuration or modifies the current configuration according to an explicit randomization scope.

Possible scopes:
- Everything.
- Shape only.
- Particle appearance.
- Motion.
- Speed.
- Gravity.
- Density.
- Scale.
- Dimension projection.
- Healing.
- Canon.
- Mathematical rules.
- Preset selection.
- Initial seed.

Requirements:
- Random mode must be deterministic when a seed is saved.
- Randomization must not silently erase user-saved universes.
- Provide a way to regenerate or undo where practical.
- Avoid random values that produce an unusable or invisible scene.
- Maintain safety limits for memory, particle count, and GPU workload.
- Random selection should produce coherent combinations rather than arbitrary incompatible settings.

---

# 14. PENCIL MENU

Pencil opens the major configuration interface.

## 14.1 Menu design

- Large panel or full-screen configuration surface.
- Scrollable sections.
- Clear section headings.
- Search or filtering for large shape/math libraries.
- Preview before applying when a change is expensive.
- Apply, cancel, and reset semantics must be explicit.
- Current active configuration must be visible.
- Avoid losing unsaved changes when switching sections.

## 14.2 Sections

1. Presets.
2. Shapes.
3. Mathematics.
4. Physics and forces.
5. Particle parameters.
6. Density and scale.
7. Dimensions and projections.
8. Self-healing.
9. Appearance.
10. Routing and relationships.
11. Simulation behavior.
12. Performance and level of detail.
13. Save/export.

## 14.3 Apply semantics

For a configuration change:
- Validate the change.
- Identify whether it affects rendering, simulation, or both.
- Apply immediately when safe.
- Transition smoothly when state migration is required.
- Show a concise progress state for expensive operations.
- Preserve the previous valid configuration if application fails.
- Never leave the simulation partially configured without a recoverable state.

---

# 15. HINT SYSTEM

Hints are floating, contextual, temporary overlays.

## 15.1 Requirements

- Hints appear at randomized positions.
- Position must remain within safe screen boundaries.
- Hints disappear after randomized durations.
- Every hint has a visible close icon.
- Close icon uses `x`.
- Close action must dismiss only the selected hint.
- Hints must not block primary controls.
- Hints must not cover critical Canon targeting or firing feedback.
- Hints must avoid excessive overlap.
- Hints must be readable in the active theme.
- Hint content must be concise.
- Hint placement must account for mobile safe areas.
- A hint should not appear repeatedly in an irritating loop.

## 15.2 Hint types

- Control discovery.
- Mathematics discovery.
- Preset discovery.
- Interaction explanation.
- Self-healing explanation.
- Higher-dimensional observation.
- Canon behavior.
- Performance and renderer information.
- Accessibility guidance.

## 15.3 Hint lifecycle

1. Select an eligible hint.
2. Check cooldown and display limits.
3. Select a safe randomized position.
4. Render with entrance animation.
5. Allow manual close.
6. Auto-dismiss after randomized duration.
7. Record dismissal or display history.
8. Avoid immediate repetition.

Hints should not be required to operate the application. Core controls must remain understandable without waiting for a hint.

---

# 16. PRESET UNIVERSES

Presets are authored configurations with particles, shapes, rules, camera setup, and visual behavior.

## 16.1 Solar System

Requirements:
- Detailed particle-based representation.
- Sun and planets.
- Orbital paths or orbital behavior.
- Relative scale options.
- Gravitational or orbital-like relationships.
- Zoomable observation.
- Optional labels in an inspection mode.
- Do not imply that a visually simplified model is a complete astrophysical simulation.

## 16.2 Walking Man

Requirements:
- Particle-generated human silhouette or skeleton.
- Joint relationships.
- Walking cycle.
- Balance and movement.
- Particle connectivity.
- Self-healing after disruption.
- Smooth transitions between standing, walking, and recovery.

## 16.3 River

Requirements:
- Flowing particle streams.
- Branching and merging.
- Local density changes.
- Current direction.
- Turbulence.
- Boundary interaction.
- Evolving riverbed or path-like structure.

## 16.4 Spacetime Fabric

Requirements:
- Grid or mesh-like particle structure.
- Curvature around selected masses or attractors.
- Wave-like disturbances.
- Camera zoom and projection.
- Clear distinction between a visualization model and a complete general-relativity solver.

## 16.5 Black Hole

Requirements:
- Central region and accretion-like structure.
- Rotational flow.
- Curved trajectories.
- Adjustable attraction model.
- Event-horizon representation.
- No false claim that the rendering is a complete physical black-hole simulation.

## 16.6 Endless Hotel

Requirements:
- Repeating architectural geometry.
- Recursive rooms and corridors.
- Perspective and scale transitions.
- Infinite-feeling navigation.
- Procedural extension or streaming.
- Camera safeguards against numerical instability.
- Clear distinction between virtual repetition and physically infinite geometry.

## 16.7 Additional presets

Suggested:
- Fractal Forest.
- Galaxy.
- Ant Colony.
- Cellular Organism.
- Ocean.
- Clockwork Universe.
- Mandelbrot World.
- DNA Helix.
- Wormhole.
- Crystal.
- Infinite Staircase.
- Neural Network.
- Sand Dune.
- Lightning Network.
- Living Coral.
- Magnetic Field.
- Solar Storm.
- Recursive City.
- Origami Geometry.
- Particle Ecosystem.

These are extensible presets, not a final maximum.

---

# 17. SMOOTHNESS CONTRACT

Smoothness is a functional requirement.

## 17.1 Required transitions

- Particle movement.
- Acceleration.
- Deceleration.
- Blasts.
- Wave propagation.
- Shape acceptance.
- Shape migration.
- Density changes.
- Realignment.
- Firings.
- Routing.
- Self-healing.
- Color transitions.
- Camera zoom.
- Camera pan.
- Menu opening.
- Hint appearance and disappearance.

## 17.2 Simulation rules

- Use a fixed timestep for simulation where appropriate.
- Use frame interpolation for rendering when needed.
- Avoid frame-rate-dependent physics.
- Avoid abrupt position assignment during ordinary transitions.
- Use stable numerical integration.
- Bound extreme velocities and forces where needed.
- Provide configurable damping and energy dissipation.
- Avoid excessive allocations inside the frame loop.
- Profile before adding expensive visual effects.

## 17.3 Visual quality

Particles should feel:
- Continuous.
- Responsive.
- Connected.
- Organic when the selected rule supports it.
- Mathematically coherent.
- Capable of local and global reactions.

Do not add random jitter as a substitute for life-like behavior.

---

# 18. RENDERING AND PERFORMANCE

## 18.1 Rendering strategy

Use:
- GPU instancing where appropriate.
- Typed arrays or packed buffers.
- Batched draw calls.
- Level of detail.
- Spatial partitioning.
- Frustum or projection culling.
- Adaptive visual complexity.
- Separate simulation and render frequencies where useful.

## 18.2 Spatial queries

Use spatial hashing, uniform grids, trees, or another appropriate spatial index for:
- Neighbor queries.
- Density calculations.
- Local forces.
- Blast propagation.
- Shape membership.
- Collision/proximity checks.

Do not compare every particle with every other particle by default.

## 18.3 Performance modes

Potential modes:
- Quality.
- Balanced.
- Performance.
- Automatic.

The user should not be forced to understand technical GPU settings to use the application.

## 18.4 Resource limits

The engine must:
- Track active particle count.
- Track GPU buffer usage where possible.
- Prevent runaway spawning.
- Use procedural or virtual representations for infinite-feeling environments.
- Degrade gracefully on weaker devices.
- Preserve interaction responsiveness.
- Avoid freezing the main thread with large synchronous operations.

---

# 19. ACCESSIBILITY AND RESPONSIVENESS

Requirements:
- Controls have accessible labels.
- Icon-only buttons expose tooltip or accessible name.
- Close buttons are keyboard and touch accessible.
- Focus states are visible.
- Menus support keyboard navigation.
- Color must not be the only source of meaning.
- Provide reduced-motion consideration for UI animation.
- Keep essential controls reachable on mobile.
- Respect safe-area insets.
- Maintain contrast across themes.
- Provide concise status feedback for configuration changes and errors.

Reduced motion:
- Reduce UI transitions when requested.
- Do not necessarily disable simulation motion unless the user explicitly requests reduced simulation motion.
- Preserve functionality when visual effects are reduced.

---

# 20. DATA AND CONFIGURATION

Use validated schemas for:
- Presets.
- Shapes.
- Math rules.
- Force models.
- Healing models.
- Canon firing models.
- User preferences.
- Saved universes.
- Hint definitions.

Every stored configuration should include:
- Schema version.
- Identifier.
- Creation or modification metadata where useful.
- Seed if deterministic behavior is expected.
- Validated parameters.
- Compatibility information when needed.

Version migrations must be explicit and tested.

---

# 21. ERROR HANDLING

Errors must be recoverable where practical.

Cases:
- WebGPU unavailable.
- WebGL2 unavailable.
- Shader compilation failure.
- Invalid mathematical expression.
- Unsupported dimension projection.
- Preset schema failure.
- Out-of-memory risk.
- Invalid Canon configuration.
- Unsupported browser feature.
- Storage failure.
- Device context loss.

Behavior:
- Preserve the last valid state where possible.
- Provide a concise explanation.
- Offer fallback or retry.
- Do not expose stack traces in the primary interface.
- Log technical details for development diagnostics.
- Never silently disable a requested feature without communicating the reason.

---

# 22. ACCEPTANCE CRITERIA

## 22.1 Canvas

- [ ] Fullscreen canvas loads.
- [ ] Grid appears correctly.
- [ ] Particles appear in a coordinated initial reveal.
- [ ] Simulation continues after loading.
- [ ] Camera supports zoom and pan.
- [ ] Theme follows system/browser by default.

## 22.2 Controls

- [ ] Four controls are visible in the selected layout.
- [ ] Icons are aligned consistently.
- [ ] Controls do not overlap safe areas.
- [ ] Controls operate independently.
- [ ] Hand mode does not deactivate Canon.
- [ ] Pencil opens the configuration system.
- [ ] Random produces a valid randomized configuration.
- [ ] Canon opens its mini-menu.

## 22.3 Hand mode

- [ ] Pan works.
- [ ] Zoom works.
- [ ] Particle touch effects are disabled.
- [ ] Swipe moves the graph/camera.
- [ ] Particles continue simulating.
- [ ] Canon can fire.
- [ ] Canon particle effects are suppressed.
- [ ] No direct particle control is possible through Hand gestures.

## 22.4 Pencil

- [ ] Shape library is searchable or browsable.
- [ ] Library architecture supports more than 200 shapes.
- [ ] Mathematical systems are modular.
- [ ] Colored particles default to OFF.
- [ ] Colored particles can be enabled.
- [ ] Self-healing can be disabled.
- [ ] Particle dimensions and density can be configured.
- [ ] Configuration errors preserve the last valid state.

## 22.5 Particles

- [ ] Particle state is persistent by default.
- [ ] Motion is continuous.
- [ ] Blasts are smooth.
- [ ] Shape transitions are smooth.
- [ ] Density transitions are smooth.
- [ ] Routing is smooth.
- [ ] Healing is smooth.
- [ ] Particle and shape rules can be extended.

## 22.6 Canon

- [ ] Canon icon exists.
- [ ] Canon mini-menu exists.
- [ ] Firing methods are selectable.
- [ ] Aim and direction work.
- [ ] Power and range can be configured.
- [ ] Cooldown and firing rate are respected.
- [ ] Canon works independently from Hand.
- [ ] Hand mode suppresses Canon particle effects.

## 22.7 Hints

- [ ] Hints appear at randomized safe positions.
- [ ] Hints disappear after randomized durations.
- [ ] Every hint has a close icon.
- [ ] Close action works independently.
- [ ] Hints do not obstruct critical controls.
- [ ] Hints support system/browser theme.
- [ ] Repetition is controlled.

## 22.8 Presets

- [ ] Solar System preset exists.
- [ ] Walking Man preset exists.
- [ ] River preset exists.
- [ ] Spacetime Fabric preset exists.
- [ ] Black Hole preset exists.
- [ ] Endless Hotel preset exists.
- [ ] Presets are editable where supported.
- [ ] Presets declare their model assumptions.

---

# 23. IMPLEMENTATION ORDER

## Phase 1: Foundation

1. Create Vite + React + TypeScript project.
2. Configure strict TypeScript.
3. Establish CSS variables and theme handling.
4. Create fullscreen canvas.
5. Implement renderer capability detection.
6. Add basic grid.
7. Add four primary controls.
8. Add camera pan and zoom.

## Phase 2: Particle engine

1. Define particle state.
2. Create simulation clock.
3. Implement typed buffers.
4. Implement basic motion.
5. Implement spatial queries.
6. Implement particle rendering.
7. Add smooth blast interaction.
8. Add density and size controls.

## Phase 3: Shape engine

1. Define shape schema.
2. Implement basic geometry generators.
3. Implement shape membership.
4. Implement transitions.
5. Add routing and spinning.
6. Add procedural shape registry.
7. Add shape browser.

## Phase 4: Healing

1. Define damage model.
2. Implement attractor-based recovery.
3. Implement shape reconstruction.
4. Add healing configuration.
5. Add enable/disable controls.
6. Test recovery after blast and shape transition.

## Phase 5: Mathematical systems

1. Implement constants.
2. Implement geometry and trigonometry.
3. Implement Fibonacci and fractal modules.
4. Implement field and force abstractions.
5. Add safe expression system.
6. Add dimension and projection abstractions.
7. Add specialized scientific visualization modules.

## Phase 6: Presets

1. Build Solar System.
2. Build Walking Man.
3. Build River.
4. Build Spacetime Fabric.
5. Build Black Hole.
6. Build Endless Hotel.
7. Add preset registry and parameter validation.

## Phase 7: Canon

1. Add Canon state.
2. Add targeting.
3. Add firing registry.
4. Add single shot and burst.
5. Add beam, wave, and spread.
6. Add force propagation.
7. Add Hand mode suppression.
8. Add visual firing feedback.

## Phase 8: Hints and polish

1. Build hint registry.
2. Add randomized safe placement.
3. Add close and auto-dismiss behavior.
4. Add accessibility labels.
5. Add responsive layouts.
6. Add performance modes.
7. Add diagnostics and error recovery.

## Phase 9: Validation

1. Run unit tests.
2. Test mobile touch behavior.
3. Test desktop pointer behavior.
4. Test Hand + Canon interaction.
5. Test theme changes.
6. Test WebGPU fallback.
7. Test large particle counts.
8. Test saved configurations.
9. Test reduced-motion behavior.
10. Perform visual comparison against the reference sketch.

---

# 24. AGENT OPERATING RULES

Any coding agent working on Continuum must follow these rules:

1. Read this file before modifying the project.
2. Treat locked product requirements as authoritative.
3. Do not replace the project with a basic particle demo.
4. Do not remove features to simplify the implementation without explicit approval.
5. Do not introduce permanent UI clutter.
6. Do not make the four controls dependent on one another.
7. Do not make Hand mode disable Canon activation.
8. Do not enable colored particles by default.
9. Do not hard-code a maximum of 200 shapes.
10. Do not claim infinite particles are literally rendered simultaneously.
11. Do not claim scientific accuracy for analogy-based models.
12. Do not evaluate arbitrary user-provided JavaScript.
13. Do not put high-frequency particle state into React state.
14. Do not use random jitter as a substitute for coherent behavior.
15. Do not use abrupt particle teleportation for ordinary transitions.
16. Do not silently overwrite saved configurations.
17. Do not hide errors that affect the active simulation.
18. Keep renderer, simulation, UI, and data validation modular.
19. Add tests for new mathematical or interaction rules.
20. Update this specification only through an explicit product decision.

## 24.1 Change protocol

Before a major change:
- Identify the affected locked requirement.
- Explain the technical reason.
- Describe the behavior change.
- State compatibility and performance implications.
- Preserve existing behavior where possible.
- Add or update acceptance criteria.
- Do not silently redefine the product.

## 24.2 Definition of done

A feature is not complete merely because it renders once.

A feature is complete when:
- Its state model is defined.
- Its interaction behavior is defined.
- Its visual behavior is coherent.
- Its failure cases are handled.
- Its performance implications are considered.
- It works with relevant modes.
- It does not violate the independent-control philosophy.
- It has tests or documented validation appropriate to its complexity.
- It preserves the reference visual direction.

---

# 25. OPTIMIZATION-FIRST AND DETERMINISTIC EXPERIENCE

This is a non-negotiable cross-cutting requirement.

**Optimization comes first, regardless of who, where, or how Continuum is opened.**

Continuum must prioritize efficient, stable, and predictable execution on every supported device, browser, renderer, viewport, input method, and entry point. The application must aim to deliver the same intended visual, mathematical, and behavioral result across environments, subject to documented hardware, precision, capability, and performance differences.

## 25.1 Optimization priority

Optimization must be considered before adding or expanding any feature.

Priority order:
1. Correctness of simulation and interaction rules.
2. Responsiveness and frame stability.
3. Memory safety and bounded resource usage.
4. Deterministic behavior and reproducibility.
5. Rendering quality.
6. Additional visual complexity.
7. Optional effects and decorative detail.

No feature is approved merely because it looks impressive if it causes avoidable instability, uncontrolled resource usage, input lag, memory leaks, or simulation divergence.

## 25.2 Same intended result

The same configuration, seed, preset, mathematical rules, and user actions should produce the same intended result across supported environments.

The implementation must:
- Use seeded random generation where randomness affects reproducibility.
- Separate simulation time from render frame rate.
- Avoid frame-rate-dependent forces or movement.
- Avoid relying on browser-specific timing behavior.
- Use explicit units and coordinate conventions.
- Define floating-point tolerance for comparisons.
- Keep rule ordering deterministic.
- Use stable sorting or explicit tie-breaking where order affects results.
- Preserve configuration versions and migration behavior.
- Keep renderer-specific differences limited to presentation or documented numerical tolerance.

Exact pixel identity cannot be guaranteed across different GPUs, browsers, display scales, color pipelines, shader implementations, and floating-point environments. The contract is therefore **same intended behavior and visual result within defined tolerances**, not an unqualified claim of bit-for-bit identical pixels on every machine.

## 25.3 Device and environment adaptation

Continuum must adapt to:
- Mobile and desktop browsers.
- Touch, mouse, trackpad, and keyboard input.
- WebGPU and WebGL2.
- Different viewport sizes and pixel ratios.
- Different GPU memory limits.
- Different CPU and GPU performance levels.
- Browser background throttling.
- Context loss and renderer recovery.
- Reduced-motion preferences.
- System/browser theme.

Adaptation must preserve simulation semantics. Lower-capability devices may reduce:
- Visual effects.
- Particle rendering level of detail.
- Shadow or glow complexity.
- Simulation sampling frequency for noncritical effects.
- Background or off-screen detail.
- Procedural visual density.

Adaptation must not silently change the meaning of core rules.

## 25.4 Performance architecture

Required practices:
- Profile before optimizing assumptions.
- Avoid unnecessary allocations in hot loops.
- Reuse typed arrays and GPU buffers where practical.
- Batch rendering work.
- Use spatial indexing for local interactions.
- Avoid all-pairs particle calculations unless the active scale is demonstrably safe.
- Move suitable workloads to workers or GPU compute when beneficial.
- Use level of detail and virtualized representations for large or infinite-feeling worlds.
- Schedule expensive operations incrementally.
- Prevent long main-thread blocks.
- Monitor frame time, memory pressure, and simulation backlog.
- Recover gracefully when the device cannot sustain the requested quality.

## 25.5 Determinism and randomness

Random behavior must have an explicit source and scope.

Required:
- Store a seed for reproducible universes.
- Distinguish deterministic procedural randomness from non-deterministic session randomness.
- Do not use uncontrolled `Math.random()` in simulation logic when reproducibility matters.
- Ensure randomization does not depend on frame rate, event timing, or object iteration order.
- Preserve random stream ordering when possible.
- Document when a GPU implementation may produce small numerical differences.

## 25.6 Performance budgets

Define and measure budgets rather than promising universal performance.

Track:
- Frame time.
- Simulation time.
- Render time.
- Input latency.
- Memory usage.
- Active logical particles.
- Visible particles.
- GPU buffer usage.
- Pending jobs.
- Context-loss recovery time.

Initial targets should be device-tier dependent:
- High-capability devices: target smooth 60 FPS or the display's supported refresh rate.
- Mid-range devices: preserve responsive interaction with adaptive quality.
- Low-capability devices: use aggressive level of detail and bounded simulation complexity.
- Unsupported devices: provide a clear fallback or capability message.

Do not treat 60 FPS as a guarantee on every device. Establish measurable budgets through profiling and automated performance tests.

## 25.7 Optimization gates for agents

Before merging a feature, the coding agent must ask:

- Does this add work to the frame loop?
- Can the work be batched, cached, deferred, or moved off the main thread?
- Does it increase memory usage?
- Does it introduce frame-rate dependence?
- Does it change deterministic behavior?
- Does it behave consistently in WebGPU and WebGL2?
- Does it degrade Hand mode, Canon mode, or touch responsiveness?
- Does it create a new all-pairs interaction?
- Does it require a level-of-detail strategy?
- Does it preserve the same intended result under adaptive quality?
- Is there a benchmark, test, or measurement supporting the change?

A feature that fails these checks must be revised, bounded, or explicitly documented before acceptance.

## 25.8 Priority rule

When requirements conflict, prefer:

1. Safety and stability.
2. Correct simulation semantics.
3. Responsiveness.
4. Deterministic intended behavior.
5. Resource efficiency.
6. Visual fidelity.
7. Optional complexity.

Never sacrifice the core experience for an avoidable effect, excessive particle count, decorative animation, or technically impressive but unstable implementation.

# 26. FINAL LOCKED SUMMARY

Continuum is a fullscreen mathematical living universe.

It contains:
- Persistent particles.
- Procedural and authored structures.
- More than 200 possible shapes and an extensible generation system.
- Mathematical constants, geometry, trigonometry, patterns, physics, fields, dimensions, and scientific-inspired models.
- Smooth movement, blasts, routing, realignment, density changes, and shape transitions.
- Configurable self-healing for particles and shapes.
- Four independent primary controls: Hand, Pencil, Random, and Canon.
- Hand mode for higher-dimensional observation and camera navigation.
- Canon firing that remains available in Hand mode but produces no particle effects there.
- Randomly positioned, randomly disappearing hints with mandatory close icons.
- Monochrome particles by default, with optional colored particles configured through Pencil.
- Presets including Solar System, Walking Man, River, Spacetime Fabric, Black Hole, and Endless Hotel.
- A modular engine designed to expand beyond a fixed library.

The implementation must preserve the feeling of a coherent, continuous, responsive, mathematical living system.

**Document status: LOCKED.**
