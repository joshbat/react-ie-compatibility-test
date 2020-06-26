import * as React from 'react';
import { FocusZone, GroupHeader, SelectionZone, GroupedList, Selection, DetailsRow, SelectionMode, IColumn } from 'office-ui-fabric-react';
import { createListItems, createGroups, IExampleItem, IExampleGroup } from '@uifabric/example-data';
import { initializeIcons } from 'office-ui-fabric-react/lib/Icons';

const groupCount = 3;
const groupDepth = 3;
const items = createListItems(Math.pow(groupCount, groupDepth + 1))
  .map(node => [node]).reduce((p, c) => p.concat(c), []);;
const columns = Object.keys(items[0])
  .slice(0, 3)
  .map(
    (key: string): IColumn => ({
      key: key,
      name: key,
      fieldName: key,
      minWidth: 300,
    }),
  );

const groups = createGroups(groupCount, groupDepth, 0, groupCount);

class List extends React.Component {
  private selection: Selection;

  updateAllGroups = (groups: IExampleGroup[]): IExampleGroup[] => {
    return groups.map(group => (
      {...group, 
      children: group.children!.length > 0 ? this.updateAllGroups(group.children!) : [],
      isCollapsed: true
    }));
  }

  onRenderCell = (nestingDepth?: number | undefined, item?: IExampleItem, itemIndex?: number | undefined) => {
    return (
      <DetailsRow
        columns={columns}
        groupNestingDepth={nestingDepth}
        item={item}
        itemIndex={itemIndex!}
        selection={this.selection}
        selectionMode={SelectionMode.multiple}
      />
    );
  };

  constructor(props: {}) {
    super(props);
    initializeIcons(/* optional base url */);
    this.selection = new Selection();
    this.selection.setItems(items);
  };

  render(){
      return (
        <div>
          <FocusZone>
            <SelectionZone selection={this.selection} selectionMode={SelectionMode.multiple}>
              <GroupedList
                items={items}
                //onRenderCell={this.onRenderCell}
                onRenderCell={() => null}
                compact={true}
                selection={this.selection}
                selectionMode={SelectionMode.multiple}
                groups={this.updateAllGroups(groups)}                 
                groupProps={{
                  showEmptyGroups: true,
                  onRenderHeader: renderHeaderProps =>
                    <GroupHeader
                      {...renderHeaderProps}
                      selectionMode = {SelectionMode.multiple}
                      styles={{
                        check: { display: 'flex', opacity: 1, maxWidth: '18px', width: '18px' },
                        title: { cursor: 'default' },
                        expand: {
                          maxWidth: '18px', width: '18px',
                          display: renderHeaderProps!.group!.children!.length > 0 ? 'initial' : 'none',
                          // display:  'initial' ,
                          backgroundColor: 'none',
                        },
                        groupHeaderContainer: { height: 'auto'  },
                      }}
                    />
                }}
              />
            </SelectionZone>
          </FocusZone>
        </div>
      )
  }
}
export default List;