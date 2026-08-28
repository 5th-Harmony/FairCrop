import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingUp, Sparkles, Plus, ShieldCheck, ArrowUpRight } from 'lucide-react-native';
import { useFarmerAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'expo-router';

export default function FarmerHomeScreen() {
  const { farmer } = useFarmerAuthStore();
  const router = useRouter();

  const priceForecasts = [
    { crop: 'Wheat (Kanak)', mandi: 'Ludhiana APMC', current: 2250, predicted: 2450, trend: '+8.8%', advice: 'Hold 4 days for peak price' },
    { crop: 'Paddy / Rice', mandi: 'Karnal Mandi', current: 3100, predicted: 3050, trend: '-1.6%', advice: 'Sell immediately' },
    { crop: 'Tomato', mandi: 'Lasalgaon Mandi', current: 1850, predicted: 2150, trend: '+16.2%', advice: 'High upside expected' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Farmer Greeting Banner */}
      <View style={styles.greetingCard}>
        <View>
          <Text style={styles.greetingTitle}>Sat Sri Akaal, {farmer?.full_name}!</Text>
          <Text style={styles.locationSub}>
            📍 {farmer?.village}, {farmer?.district}, {farmer?.state}
          </Text>
        </View>
        <View style={styles.verifiedBadge}>
          <ShieldCheck color="#10B981" size={16} />
          <Text style={styles.verifiedText}>Verified Kisan</Text>
        </View>
      </View>

      {/* ML Optimal Sale Window Advisory Card */}
      <View style={styles.advisoryCard}>
        <View style={styles.advisoryHeader}>
          <Sparkles color="#F59E0B" size={20} />
          <Text style={styles.advisoryTitle}>AI BEST TIME TO SELL ADVISORY</Text>
        </View>
        <Text style={styles.advisoryBody}>
          🌾 <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Wheat Prices in Ludhiana APMC</Text> are predicted to rise by <Text style={{ color: '#10B981', fontWeight: 'bold' }}>+8.8%</Text> over the next 4 days.
        </Text>
        <TouchableOpacity style={styles.listHarvestBtn} onPress={() => router.push('/list-harvest')}>
          <Plus color="#FFFFFF" size={18} />
          <Text style={styles.listHarvestBtnText}>List Harvest Lot Now</Text>
        </TouchableOpacity>
      </View>

      {/* Mandi Price Predictions List */}
      <Text style={styles.sectionTitle}>Live Mandi Prices & 7-Day Forecast</Text>
      {priceForecasts.map((item, idx) => (
        <View key={idx} style={styles.priceCard}>
          <View style={styles.priceCardHeader}>
            <View>
              <Text style={styles.cropName}>{item.crop}</Text>
              <Text style={styles.mandiName}>{item.mandi}</Text>
            </View>
            <View style={styles.trendBadge}>
              <ArrowUpRight color="#10B981" size={14} />
              <Text style={styles.trendText}>{item.trend}</Text>
            </View>
          </View>

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Today's Price</Text>
              <Text style={styles.priceVal}>₹{item.current} /qtl</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.priceLabel}>Predicted Peak</Text>
              <Text style={[styles.priceVal, { color: '#10B981' }]}>₹{item.predicted} /qtl</Text>
            </View>
          </View>

          <View style={styles.adviceBanner}>
            <TrendingUp color="#38BDF8" size={14} />
            <Text style={styles.adviceText}>{item.advice}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  content: { padding: 16, gap: 16 },
  greetingCard: {
    backgroundColor: '#1C2541',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  greetingTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  locationSub: { color: '#94A3B8', fontSize: 12, marginTop: 4 },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },
  advisoryCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    gap: 10,
  },
  advisoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  advisoryTitle: { color: '#F59E0B', fontSize: 12, fontWeight: 'bold', letterSpacing: 0.5 },
  advisoryBody: { color: '#CBD5E1', fontSize: 13, lineHeight: 18 },
  listHarvestBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  listHarvestBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  sectionTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  priceCard: {
    backgroundColor: '#1C2541',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#3A506B',
    gap: 10,
  },
  priceCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cropName: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
  mandiName: { color: '#94A3B8', fontSize: 11 },
  trendBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: { color: '#10B981', fontSize: 11, fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { color: '#64748B', fontSize: 11 },
  priceVal: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  adviceBanner: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  adviceText: { color: '#38BDF8', fontSize: 11, fontWeight: '600' },
});
