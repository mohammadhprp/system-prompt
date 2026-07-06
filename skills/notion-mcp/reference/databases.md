# Database Management

## Overview

Notion databases consist of views on top of data sources. A data source (collection) holds the actual schema and pages. A database can have multiple data sources (linked databases). Use `fetch` first to get the database structure and data source IDs from `<data-source>` tags.

```
fetch
  id: "database-uuid-here"
```

## Create Database

Uses SQL DDL syntax to define the schema:

```
create-database
  title: "Tasks"
  parent:
    page_id: "abc123..."           # where to place the database
  schema: |
    CREATE TABLE (
      "Task Name" TITLE,
      "Status" SELECT('To Do':red, 'In Progress':yellow, 'Done':green),
      "Priority" NUMBER FORMAT 'dollar',
      "Due Date" DATE,
      "Assignee" PEOPLE,
      "Tags" MULTI_SELECT('eng':blue, 'design':pink),
      "URL" URL,
      "Email" EMAIL,
      "Complete" CHECKBOX,
      "Task ID" UNIQUE_ID PREFIX 'TASK'
    )
  description: "Team task tracker"
```

### Column types

| Type | SQL Syntax |
|------|------------|
| Title | `TITLE` |
| Rich text | `RICH_TEXT` |
| Date | `DATE` |
| People | `PEOPLE` |
| Checkbox | `CHECKBOX` |
| URL | `URL` |
| Email | `EMAIL` |
| Phone | `PHONE_NUMBER` |
| Status | `STATUS` |
| Files | `FILES` |
| Number | `NUMBER [FORMAT 'dollar']` |
| Select | `SELECT('opt1':red, 'opt2':blue)` |
| Multi-select | `MULTI_SELECT('opt1':green, 'opt2':pink)` |
| Formula | `FORMULA('prop("A") + prop("B")')` |
| Relation | `RELATION('data_source_id')` or `RELATION('ds_id', DUAL)` |
| Rollup | `ROLLUP('relation_prop', 'target_prop', 'function')` |
| Unique ID | `UNIQUE_ID [PREFIX 'X']` |
| Created time | `CREATED_TIME` |
| Last edited | `LAST_EDITED_TIME` |

Column colors: `default`, `gray`, `brown`, `orange`, `yellow`, `green`, `blue`, `purple`, ` pink`, `red`

Add descriptions: `"Status" STATUS COMMENT 'Current task status'`

### Self-referencing relation (two-step)

1. Create the database without the relation
2. Use `update-data-source` with the returned `data_source_id` to add the relation:

```
update-data-source
  data_source_id: "abc123..."
  statements: |
    ADD COLUMN "Parent" RELATION('abc123...', DUAL 'Children' 'children');
    ADD COLUMN "Children" RELATION('abc123...', DUAL 'Parent' 'parent')
```

## Update Data Source

Modify a data source's schema, title, or description.

```
update-data-source
  data_source_id: "f336d0bc-..."
  title: "Project Tracker 2025"

  statements: |
    ADD COLUMN "Priority" SELECT('High':red, 'Medium':yellow, 'Low':green);
    ADD COLUMN "Due Date" DATE;
    RENAME COLUMN "Status" TO "Progress";
    ALTER COLUMN "Priority" SET SELECT('P0':red, 'P1':orange, 'P2':green);
    DROP COLUMN "Old Column"
```

### Statements

- `ADD COLUMN "Name" <type>` — add a property
- `DROP COLUMN "Name"` — remove a property (only if unused in views)
- `RENAME COLUMN "Old" TO "New"` — rename a property
- `ALTER COLUMN "Name" SET <type>` — change type/options
- `ALTER COLUMN "Name" SET COMMENT 'new description'` — update description

Cannot delete or create title properties. Max one `UNIQUE_ID` property.

## Views

### Create View

```
create-view
  data_source_id: "abc123..."
  name: "Sprint Board"
  type: "board"                 # table, board, list, calendar, timeline, gallery, form, chart, map, dashboard
  configure: |
    GROUP BY "Status";
    SORT BY "Due Date" ASC;
    FILTER "Priority" != "Low"
```

Or add a view to an existing database:

```
create-view
  database_id: "abc123..."
  data_source_id: "abc123..."
  name: "All Tasks"
  type: "table"
```

Or create a linked database view on a page:

```
create-view
  parent_page_id: "ghi789..."
  data_source_id: "abc123..."
  name: "Company tasks"
  type: "table"
  configure: |
    FILTER "Company" = "Acme"
```

### View types and required directives

| View type | Required |
|-----------|----------|
| table | — |
| board | `GROUP BY "Property"` |
| list | — |
| calendar | `CALENDAR BY "DateProperty"` |
| timeline | `TIMELINE BY "Start" TO "End"` |
| gallery | — |
| form | — |
| chart | `CHART column\|bar\|line\|donut\|number` |
| map | `MAP BY "LocationProperty"` |
| dashboard | — |

### View DSL directives

```
FILTER "Status" = "In Progress"           # filter rows
SORT BY "Due Date" ASC                     # sort rows
GROUP BY "Status"                          # group/board columns
CALENDAR BY "Date"                         # calendar date property
TIMELINE BY "Start" TO "End"               # timeline date range
MAP BY "Location"                          # map location property
CHART bar AGGREGATE count                  # chart type + aggregation
SHOW "Name", "Status", "Due Date"          # visible properties
HIDE "Internal Note"                        # hidden properties
COVER "Image"                              # cover image property
WRAP CELLS true                             # wrap cell content
FREEZE COLUMNS 2                            # freeze first N columns
FORM CLOSE | OPEN                           # form submissions
FORM ANONYMOUS true | false                 # anonymous submissions
FORM PERMISSIONS none | reader | editor    # form submission permissions
```

### Update View

```
update-view
  view_id: "abc123..."          # view:// URI, Notion URL with ?v=, or bare UUID
  name: "Q1 Sprint Board"
  configure: |
    CLEAR FILTER;
    CLEAR SORT;
    GROUP BY "Priority"
```

### Clear directives

- `CLEAR FILTER` — remove all filters
- `CLEAR SORT` — remove all sorts
- `CLEAR GROUP BY` — remove grouping
