---
'@nostalgiaui/react': minor
'@nostalgiaui/tokens': minor
'@nostalgiaui/mcp': patch
---

Add Slider and its parts (SliderLabel, SliderValue, SliderControl, SliderTrack, SliderIndicator, SliderThumb), thin wrappers over Base UI's Slider styled in every era (#24). The thumb is drawn in the body text color and larger than the track, so its outline sits on the page surface; the track keeps a muted edge and the range is the accent. The contrast audit gains `slider-thumb-on-surface` and `slider-range-on-track`, which `check_contrast` now reports. `get_component` now answers for Slider.
