import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';

class DataTableCell extends React.PureComponent {
  static displayName = 'DataTable.Cell';

  render = () => {
    const { children, style, numeric, numberOfLines, ...rest } = this.props;

    return (
      <TouchableRipple
        {...rest}
        style={[styles.container, numeric && styles.right, style]}
      >
        <Text numberOfLines={numberOfLines || 1}>{children}</Text>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  right: {
    justifyContent: 'flex-end',
  },
});

export default DataTableCell;
