import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ListHarvestScreen() {
  const router = useRouter();
  const [cropName, setCropName] = useState('Wheat');
  const [quantity, setQuantity] = useState('5000');
  const [expectedPrice, setExpectedPrice] = useState('22.5');
  const [grade, setGrade] = useState('GRADE_A');
  const [location, setLocation] = useState('Samrala Mandi Storage, Ludhiana');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      Alert.alert('Harvest Lot Listed!', 'Your produce lot is now live in the buyer marketplace.');
      router.push('/offers');
    }, 1200);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>List New Harvest Lot</Text>
      <Text style={styles.subtitle}>Directly reach institutional buyers with smart price discovery</Text>

      {/* Form */}
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Crop / Commodity Name</Text>
          <TextInput
            style={styles.input}
            value={cropName}
            onChangeText={setCropName}
            placeholder="E.g. Wheat, Rice, Tomato"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Harvest Quantity (in kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="E.g. 5000"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expected Minimum Price (₹ per kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={expectedPrice}
            onChangeText={setExpectedPrice}
            placeholder="E.g. 22.5"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quality Grade</Text>
          <View style={styles.gradeOptions}>
            {['GRADE_A', 'GRADE_B', 'ORGANIC', 'PREMIUM'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.gradeChip, grade === g && styles.gradeChipActive]}
                onPress={() => setGrade(g)}
              >
                <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>
                  {g.replace('_', ' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Storage / Pickup Address</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Storage location"
            placeholderTextColor="#64748B"
          />
        </View>

        {/* Upload Harvest Photo Button */}
        <TouchableOpacity style={styles.photoUploadBtn}>
          <Camera color="#10B981" size={22} />
          <Text style={styles.photoUploadText}>Upload Harvest Photos (Optional)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitBtnText}>Publish Listing to Buyers</Text>
          <ArrowRight color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B' },
  content: { padding: 16, gap: 12 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  subtitle: { color: '#94A3B8', fontSize: 12 },
  formCard: {
    backgroundColor: '#1C2541',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#3A506B',
    gap: 14,
    marginTop: 8,
  },
  inputGroup: { gap: 6 },
  label: { color: '#CBD5E1', fontSize: 12, fontWeight: '600' },
  input: {
    backgroundColor: '#0B132B',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3A506B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  gradeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gradeChip: {
    backgroundColor: '#0B132B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3A506B',
  },
  gradeChipActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  gradeText: { color: '#94A3B8', fontSize: 11, fontWeight: 'bold' },
  gradeTextActive: { color: '#FFFFFF' },
  photoUploadBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderStyle: 'dashed',
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  photoUploadText: { color: '#10B981', fontSize: 13, fontWeight: 'bold' },
  submitBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' },
});
