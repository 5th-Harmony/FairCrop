import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Check, X, ShieldCheck } from 'lucide-react-native';

export default function FarmerOffersScreen() {
  const [offers, setOffers] = useState([
    {
      id: 201,
      crop: 'Wheat (Lot #1001)',
      buyer: 'Reliance Retail Agri Procurement',
      offeredPrice: 23.5,
      quantity: 5000,
      totalValue: 117500,
      message: 'Logistics arranged directly by Reliance. Escrow deposit ready.',
      status: 'PENDING',
    },
    {
      id: 202,
      crop: 'Wheat (Lot #1001)',
      buyer: 'ITC Choupal Fresh',
      offeredPrice: 23.0,
      quantity: 5000,
      totalValue: 115000,
      message: 'Immediate delivery pickup from Ludhiana hub.',
      status: 'PENDING',
    },
  ]);

  const handleRespond = (offerId: number, status: 'ACCEPTED' | 'REJECTED') => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status } : o))
    );
    if (status === 'ACCEPTED') {
      Alert.alert(
        'Contract Accepted & Escrow Initiated!',
        'The buyer has been notified to deposit funds into escrow. Prepare produce for dispatch.'
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Incoming Buyer Bids</Text>
      <Text style={styles.subtitle}>Direct contracts with verified institutional buyers</Text>

      {offers.map((offer) => (
        <View key={offer.id} style={styles.offerCard}>
          <View style={styles.offerHeader}>
            <View>
              <Text style={styles.cropTitle}>{offer.crop}</Text>
              <Text style={styles.buyerName}>🏢 {offer.buyer}</Text>
            </View>
            <View style={[styles.statusBadge, offer.status === 'ACCEPTED' && styles.statusBadgeAccepted]}>
              <Text style={[styles.statusText, offer.status === 'ACCEPTED' && styles.statusTextAccepted]}>
                {offer.status}
              </Text>
            </View>
          </View>

          <View style={styles.priceGrid}>
            <View>
              <Text style={styles.label}>Offered Rate</Text>
              <Text style={styles.valPrice}>₹{offer.offeredPrice} /kg</Text>
            </View>
            <View>
              <Text style={styles.label}>Volume</Text>
              <Text style={styles.val}>{(offer.quantity / 100).toFixed(1)} Qtl</Text>
            </View>
            <View>
              <Text style={styles.label}>Total Contract</Text>
              <Text style={[styles.valPrice, { color: '#10B981' }]}>
                ₹{offer.totalValue.toLocaleString()}
              </Text>
            </View>
          </View>

          <Text style={styles.messageText}>"{offer.message}"</Text>

          {offer.status === 'PENDING' ? (
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleRespond(offer.id, 'REJECTED')}
              >
                <X color="#EF4444" size={16} />
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptBtn}
                onPress={() => handleRespond(offer.id, 'ACCEPTED')}
              >
                <Check color="#FFFFFF" size={16} />
                <Text style={styles.acceptText}>Accept Contract</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.escrowLockedBanner}>
              <ShieldCheck color="#10B981" size={16} />
              <Text style={styles.escrowLockedText}>Digital Contract Active • Escrow Lock Pending</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  content: { padding: 16, gap: 14 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#94A3B8', fontSize: 12 },
  offerCard: {
    backgroundColor: '#1C2541',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3A506B',
    gap: 12,
  },
  offerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cropTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  buyerName: { color: '#38BDF8', fontSize: 12, marginTop: 2, fontWeight: '600' },
  statusBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeAccepted: { backgroundColor: 'rgba(16, 185, 129, 0.15)' },
  statusText: { color: '#F59E0B', fontSize: 10, fontWeight: 'bold' },
  statusTextAccepted: { color: '#10B981' },
  priceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0B132B',
    padding: 12,
    borderRadius: 10,
  },
  label: { color: '#64748B', fontSize: 10, textTransform: 'uppercase' },
  val: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', marginTop: 2 },
  valPrice: { color: '#38BDF8', fontSize: 14, fontWeight: 'bold', marginTop: 2 },
  messageText: { color: '#CBD5E1', fontSize: 12, fontStyle: 'italic' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  rejectBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  rejectText: { color: '#EF4444', fontWeight: 'bold', fontSize: 13 },
  acceptBtn: {
    flex: 2,
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  acceptText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 13 },
  escrowLockedBanner: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  escrowLockedText: { color: '#10B981', fontSize: 12, fontWeight: 'bold' },
});
