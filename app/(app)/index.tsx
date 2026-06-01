import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { fetchResourcesByClass } from "../../src/services/resources";
import type { Resource } from "../../src/types";

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadResources = useCallback(async () => {
    setLoading(true);
    const data = await fetchResourcesByClass("Matemáticas");
    setResources(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadResources();
  }, [loadResources]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadResources();
    setRefreshing(false);
  }, [loadResources]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Bienvenido, {user?.name}</Text>
      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay recursos disponibles</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.resourceTitle}>{item.title}</Text>
            <Text style={styles.resourceMeta}>{item.clase} · {item.status}</Text>
            {item.url ? <Text style={styles.resourceLink}>{item.url}</Text> : null}
          </View>
        )}
      />
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#F9FAFB"
  },
  title: {
    color: "#0F172A",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4
  },
  subtitle: {
    color: "#475569",
    marginBottom: 20
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    marginBottom: 14
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6
  },
  resourceMeta: {
    color: "#6B7280",
    marginBottom: 8
  },
  resourceLink: {
    color: "#0070F3",
    fontSize: 14
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center"
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700"
  },
  emptyText: {
    color: "#64748B",
    textAlign: "center",
    marginTop: 24
  }
});
