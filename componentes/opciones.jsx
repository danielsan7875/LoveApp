import { useNavigation } from '@react-navigation/native';

const MenuItem = ({ iconName, text, route }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => route && navigation.navigate(route)}
    >
      <Ionicons name={iconName} size={24} color="#FF69B4" style={styles.icon} />
      <Text style={styles.menuText}>{text}</Text>
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );
};
