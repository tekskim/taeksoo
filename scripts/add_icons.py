#!/usr/bin/env python3
import os
import re
import xml.etree.ElementTree as ET
from pathlib import Path

def to_camel_case(name):
    """Convert file name to camel case component name"""
    # Remove .svg extension
    name = name.replace('.svg', '')
    # Handle special cases
    name = name.replace(' ', '')
    name = name.replace('-', '')
    # Split by capital letters and join
    parts = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)', name)
    if not parts:
        parts = [name]
    return ''.join(word.capitalize() for word in parts)

def extract_svg_content(svg_path):
    """Extract path elements from SVG file"""
    try:
        tree = ET.parse(svg_path)
        root = tree.getroot()
        
        # Get namespace
        ns = {'svg': 'http://www.w3.org/2000/svg'}
        
        paths = []
        for path in root.findall('.//svg:path', ns):
            paths.append(path)
        for path in root.findall('.//path'):
            if path not in paths:
                paths.append(path)
        
        if not paths:
            return None
        
        # Extract attributes
        result = []
        for path in paths:
            attrs = {}
            for key, value in path.attrib.items():
                attrs[key] = value
            result.append(attrs)
        
        return result
    except Exception as e:
        print(f"Error parsing {svg_path}: {e}")
        return None

def generate_icon_component(icon_name, svg_path):
    """Generate React component code for an icon"""
    paths = extract_svg_content(svg_path)
    if not paths:
        return None
    
    component_name = f"Icon{icon_name}"
    
    # Build path elements
    path_elements = []
    for i, path_attrs in enumerate(paths):
        d = path_attrs.get('d', '')
        stroke = path_attrs.get('stroke', 'black')
        stroke_width = path_attrs.get('stroke-width', '1')
        stroke_linecap = path_attrs.get('stroke-linecap', 'round')
        stroke_linejoin = path_attrs.get('stroke-linejoin', 'round')
        fill = path_attrs.get('fill', 'none')
        
        # Handle color variable
        if stroke == '#0F172A' or stroke == 'black':
            stroke_color = '{color}'
        else:
            stroke_color = f'"{stroke}"'
        
        path_jsx = f"""        <path
          d="{d}"
          stroke={stroke_color}
          strokeWidth={{{stroke}}} 
          strokeLinecap="{stroke_linecap}"
          strokeLinejoin="{stroke_linejoin}"
          fill="{fill}"
        />"""
        path_elements.append(path_jsx)
    
    paths_jsx = '\n'.join(path_elements)
    
    component_code = f'''
/**
 * {icon_name} - 16x16 프레임
 */
export const {component_name} = forwardRef<SVGSVGElement, CustomIconProps>(
  ({{ size = 16, color = 'currentColor', stroke = 1, className, style, ...props }}, ref) => {{
    return (
      <svg
        ref={{ref}}
        xmlns="http://www.w3.org/2000/svg"
        width={{size}}
        height={{size}}
        viewBox="0 0 16 16"
        fill="none"
        className={{className}}
        style={{style}}
        {{...props}}
      >
{paths_jsx}
      </svg>
    );
  }}
);
{component_name}.displayName = '{component_name}';
'''
    return component_code

def main():
    icons_dir = Path('src/assets/icons')
    custom_icons_file = Path('src/design-system/components/Icons/CustomIcons.tsx')
    
    # Read existing icons to check for duplicates
    existing_icons = set()
    if custom_icons_file.exists():
        with open(custom_icons_file, 'r', encoding='utf-8') as f:
            content = f.read()
            # Find all IconXXX patterns
            matches = re.findall(r'export const (Icon\w+)', content)
            existing_icons = set(matches)
    
    # Process all SVG files
    svg_files = sorted(icons_dir.glob('*.svg'))
    new_components = []
    renamed_icons = {}
    
    for svg_file in svg_files:
        icon_name = to_camel_case(svg_file.stem)
        component_name = f"Icon{icon_name}"
        
        # Check if icon already exists
        if component_name in existing_icons:
            # Rename existing to IconXXX2
            new_component_name = f"{component_name}2"
            renamed_icons[component_name] = new_component_name
            print(f"Renaming existing {component_name} to {new_component_name}")
            # Use new name for the new icon
            component_name = icon_name
        else:
            component_name = icon_name
        
        # Generate component code
        component_code = generate_icon_component(component_name, svg_file)
        if component_code:
            new_components.append((component_name, component_code))
            print(f"Generated {component_name} from {svg_file.name}")
    
    # Write new components to file
    if new_components:
        with open(custom_icons_file, 'a', encoding='utf-8') as f:
            for icon_name, component_code in new_components:
                f.write(component_code)
        
        print(f"\nAdded {len(new_components)} new icon components to CustomIcons.tsx")
        if renamed_icons:
            print(f"Note: {len(renamed_icons)} existing icons need to be renamed to IconXXX2")
    else:
        print("No new icons to add")

if __name__ == '__main__':
    main()

