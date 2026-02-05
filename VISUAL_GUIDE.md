# Desktop App - Chart Display Feature - Visual Guide

## User Experience Flow

### Before Upload
```
┌─────────────────────────────────────┐
│         UPLOAD PAGE                 │
├─────────────────────────────────────┤
│                                     │
│  📁 Drag & drop CSV file here       │
│     or click Browse to select       │
│                                     │
│  [Browse] [Select file...]          │
│  [Upload & Analyze]                 │
│  [📄 Use Demo Dataset]              │
│                                     │
│  Required Columns:                  │
│  • Equipment Name                   │
│  • Type                             │
│  • Flowrate                         │
│  • Pressure                         │
│  • Temperature                      │
│                                     │
└─────────────────────────────────────┘
```

### During Upload
```
┌─────────────────────────────────────┐
│         UPLOAD PAGE                 │
├─────────────────────────────────────┤
│                                     │
│  📁 Drag & drop CSV file here       │
│  Selected: equipment_data.csv       │
│                                     │
│  [Browse]                           │
│  [⏳ Uploading & Analyzing...]      │ ← Processing
│  [📄 Use Demo Dataset]              │   (disabled)
│                                     │
│  ✓ Upload successful!               │
│    Generating charts...             │ ← Status
│                                     │
└─────────────────────────────────────┘
```

### After Upload - Charts Display
```
┌─────────────────────────────────────────────────┐
│             CHARTS PAGE                         │
│                                                 │
│  Analysis Results    [📤 Upload Another]        │
│  ─────────────────────────────────────────────  │
│  Analysis complete for dataset #1               │
│                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┐  │
│  │🔧 Total  │💨 Avg    │⚡ Avg    │🌡️  Avg   │  │
│  │Equipment │Flowrate  │Pressure  │Temperature│ │
│  │    10    │  50.5    │  101.3   │   25.0°  │  │
│  └──────────┴──────────┴──────────┴──────────┘  │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Equipment Type Distribution             │   │
│  │                                         │   │
│  │  Count                                  │   │
│  │    4  ▓▓▓▓                              │   │
│  │    3  ▓▓▓                               │   │
│  │    2  ▓▓                                │   │
│  │    1  ▓                                 │   │
│  │       Pump  Valve Tank  Other           │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Type Distribution (Percentage)          │   │
│  │                                         │   │
│  │        ╭─────────────╮                  │   │
│  │      ╱   Pump: 40%  ╲                   │   │
│  │    ╱ Valve: 30%      ╲                  │   │
│  │   │  Tank: 20%        │                 │   │
│  │    ╲  Other: 10%     ╱                  │   │
│  │      ╲────────────╭─╯                   │   │
│  │           40% - 10%                     │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Sidebar Navigation

```
┌──────────────┐
│   ChemViz    │
│  Chemical    │
│  Equipment   │
│  Visualizer  │
├──────────────┤
│              │
│ 📤 Upload    │ ← Current: After uploading
│ 📊 Charts    │ ← Auto-selected after upload
│ 📁 History   │
│              │
│ (divider)    │
│              │
│ 🚪 Logout    │
│              │
└──────────────┘
```

## Component Interactions

### Signal Flow
```
UploadPage
    │
    ├─> [File Selected]
    │       └─> upload_btn enabled
    │
    └─> [Upload & Analyze clicked]
            └─> api_client.upload_csv()
                    │
                    ├─> Success ✓
                    │   └─> upload_complete.emit(result)
                    │       │
                    │       └─> MainWindow.on_upload_complete(data)
                    │           │
                    │           ├─> charts_page.display_results(data)
                    │           ├─> upload_page.reset()
                    │           └─> switch_page(1)
                    │
                    └─> Error ✗
                        └─> status_label shows error
```

### Charts Page Navigation
```
ChartsPage
    │
    ├─> [📤 Upload Another button]
    │   └─> back_to_upload.emit()
    │       └─> MainWindow: switch_page(0)
    │           └─> Back to Upload Page
    │
    └─> [📊 Charts in sidebar]
        └─> Chart stays visible
```

## Data Processing Pipeline

```
CSV File Input
    │
    ▼
[Upload Page]
    ├─> Validate file extension (.csv)
    ├─> Select file path
    └─> Click "Upload & Analyze"
    
    │
    ▼
[API Client]
    ├─> POST /api/equipment/upload/
    ├─> Include CSV file
    ├─> Include auth token
    └─> Get response
    
    │
    ▼
[Backend Processing]
    ├─> Parse CSV
    ├─> Validate columns
    ├─> Calculate statistics:
    │   ├─> Total equipment count
    │   ├─> Average flowrate
    │   ├─> Average pressure
    │   ├─> Average temperature
    │   └─> Type distribution
    ├─> Save to database
    └─> Return summary
    
    │
    ▼
[Charts Page]
    ├─> Extract summary data
    ├─> Create stat cards
    ├─> Create bar chart (type distribution)
    ├─> Create pie chart (percentages)
    └─> Render all visualizations
    
    │
    ▼
[User Sees Results]
    └─> 4 stat cards + 2 charts displayed
```

## State Machine - Page Navigation

```
                    ┌─────────────┐
                    │   LOGIN     │
                    │   PAGE      │
                    └──────┬──────┘
                           │
                    ✓ Login Success
                           │
                           ▼
     ┌──────────────────────────────────────┐
     │                                      │
     │  Start → [UPLOAD PAGE] ◄─────────┐   │
     │              ↓                    │   │
     │         ✓ Upload                 │   │
     │              ↓                    │   │
     │        [CHARTS PAGE] ─────────────┘   │
     │              ↑                        │
     │    ✓ View History Item               │
     │              │                        │
     │         [HISTORY PAGE]                │
     │              ↑                        │
     │              └─ Navbar click         │
     │                                      │
     └──────────────────────────────────────┘
             ^ (Sidebar Navigation)
             │
            All pages connected via sidebar
```

## Styling Colors

### Chart Theme
- **Background**: `#0a0e1a` (Dark Navy)
- **Text**: `#f0f4f8` (Light Blue)
- **Grid Lines**: `#334155` (Slate)

### Chart Bar Colors
- Bar 1: `#63caff` (Cyan)
- Bar 2: `#34d399` (Green)
- Bar 3: `#fbbf24` (Amber)
- Bar 4: `#fb7185` (Pink)
- Bar 5: `#a78bfa` (Purple)
- Bar 6: `#38bdf8` (Sky Blue)

### Pie Chart
- Uses same color palette
- Dark background: `#151d2f`
- Text: `#f0f4f8`

## Stat Card Layout

```
┌────────────────────────┐
│ 🔧 Total Equipment     │  ← Icon + Title
│                        │
│        10              │  ← Large Value (28pt)
└────────────────────────┘
```

## Button States

### Upload Button
- **Disabled State**: "Upload & Analyze" (gray, not clickable)
- **Ready State**: "Upload & Analyze" (blue, clickable)
- **Loading State**: "⏳ Uploading & Analyzing..." (blue, disabled)
- **Error State**: "Upload & Analyze" (blue, clickable after error)

### Secondary Buttons
- **Browse**: Open file dialog
- **Use Demo Dataset**: Auto-select and upload demo
- **Upload Another**: Return to upload page from charts

## Error Messages

```
Upload Page - Error Display:
┌─────────────────────────────────────┐
│ ✗ Cannot connect to server          │  ← Error Label
│   (Connection refused)              │
└─────────────────────────────────────┘

Upload Page - Success:
┌─────────────────────────────────────┐
│ ✓ Upload successful!                │  ← Success Label
│   Generating charts...              │
└─────────────────────────────────────┘
```

## Responsive Behavior

### Small Window (800x600)
- All components stack vertically
- Scrollable areas for overflow
- Charts resize proportionally
- Mobile-friendly layout

### Large Window (1920x1200)
- Stat cards in 4-column grid
- Charts display side-by-side
- Full content visible without scroll
- Optimized spacing

## Performance Notes

- ✓ Charts render in <1 second (typical)
- ✓ Stat cards appear instantly
- ✓ No UI blocking during chart generation
- ✓ File upload progress shown
- ✓ Smooth transitions between pages
