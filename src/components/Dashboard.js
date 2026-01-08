import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../friendFirebase";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Dashboard() {
  const [patients, setPatients] = useState({});
  const [doctors, setDoctors] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("🔍 Starting data fetch from Firebase...");

        // Fetch patients
        const patientsRef = ref(database, "users/patients");
        const patientsSnapshot = await new Promise((resolve) => {
          onValue(patientsRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
        });
        const patientsData = patientsSnapshot.val() || {};
        console.log("✅ Patients loaded:", Object.keys(patientsData).length);
        setPatients(patientsData);

        // Fetch doctors
        const doctorsRef = ref(database, "users/doctors");
        const doctorsSnapshot = await new Promise((resolve) => {
          onValue(doctorsRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
        });
        const doctorsData = doctorsSnapshot.val() || {};
        console.log("✅ Doctors loaded:", Object.keys(doctorsData).length);
        setDoctors(doctorsData);

        // Fetch appointments
        const appointmentsRef = ref(database, "appointments");
        const appointmentsSnapshot = await new Promise((resolve) => {
          onValue(appointmentsRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
        });
        const appointmentsData = appointmentsSnapshot.val() || {};
        console.log("📊 Raw appointments data structure:", appointmentsData);

        // Process appointments - handle the nested user structure
        const allAppointments = [];
        
        if (appointmentsData && typeof appointmentsData === 'object') {
          // Loop through each user ID
          Object.keys(appointmentsData).forEach(userId => {
            const userAppointments = appointmentsData[userId];
            
            if (userAppointments && typeof userAppointments === 'object') {
              // Loop through each appointment for this user
              Object.keys(userAppointments).forEach(appointmentId => {
                const appointment = userAppointments[appointmentId];
                
                if (appointment && typeof appointment === 'object') {
                  allAppointments.push({
                    id: appointmentId,
                    userId: userId,
                    ...appointment
                  });
                }
              });
            }
          });
        }

        console.log("📈 Total processed appointments:", allAppointments.length);
        setAppointments(allAppointments);
        setLoading(false);

      } catch (error) {
        console.error("❌ Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debug effect to analyze appointments in detail
  useEffect(() => {
    if (appointments.length > 0 && !loading) {
      console.log("=== 🔍 DETAILED APPOINTMENT ANALYSIS ===");
      
      appointments.forEach((apt, index) => {
        console.log(`📋 Appointment ${index + 1}/${appointments.length}:`, {
          id: apt.id,
          // Log ALL fields to see what's available
          allFields: Object.keys(apt),
          // Specific status fields
          doctorStatus: apt.doctorStatus,
          patientStatus: apt.patientStatus,
          status: apt.status,
          // Type of status fields
          doctorStatusType: typeof apt.doctorStatus,
          patientStatusType: typeof apt.patientStatus,
          // Raw values for inspection
          doctorStatusRaw: apt.doctorStatus,
          patientStatusRaw: apt.patientStatus,
        });
        
        // Check if status contains "completed"
        const docStatus = String(apt.doctorStatus || '');
        const patStatus = String(apt.patientStatus || '');
        
        console.log(`   Doctor Status Analysis:`, {
          raw: docStatus,
          lowercase: docStatus.toLowerCase(),
          includesCompleted: docStatus.toLowerCase().includes('completed'),
          trim: docStatus.trim(),
          exactMatch: docStatus.trim().toLowerCase() === 'completed'
        });
        
        console.log(`   Patient Status Analysis:`, {
          raw: patStatus,
          lowercase: patStatus.toLowerCase(),
          includesCompleted: patStatus.toLowerCase().includes('completed'),
          trim: patStatus.trim(),
          exactMatch: patStatus.trim().toLowerCase() === 'completed'
        });
      });
      console.log("=== 🏁 END ANALYSIS ===");
    }
  }, [appointments, loading]);

  if (loading) {
    return (
      <div style={{ 
        padding: 20, 
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh'
      }}>
        <div>
          <h3>Loading dashboard...</h3>
          <p>Fetching data from Firebase</p>
        </div>
      </div>
    );
  }

  // Count verification status
  const countVerification = (data) => {
    let verified = 0, unverified = 0;
    Object.values(data).forEach((item) => {
      if (item && typeof item === 'object') {
        const status = 
          item.services?.eyecare?.["verification-status"] ||
          item["verification-status"] ||
          item.verificationStatus ||
          "unverified";
        
        if (status.toLowerCase() === "verified") verified++;
        else unverified++;
      }
    });
    return { verified, unverified, total: Object.keys(data).length };
  };

  const doctorStats = countVerification(doctors);
  const patientStats = countVerification(patients);

  // IMPROVED: Count completed/not completed with better status detection
  let doctorCompleted = 0, doctorNotCompleted = 0;
  let patientCompleted = 0, patientNotCompleted = 0;

  console.log("🎯 IMPROVED STATUS COUNTING:");
  
  appointments.forEach((apt, index) => {
    if (!apt || typeof apt !== 'object') return;

    // Get status values as strings
    const docStatus = String(apt.doctorStatus || '');
    const patStatus = String(apt.patientStatus || '');

    // Clean and analyze doctor status
    const cleanDocStatus = docStatus.trim().toLowerCase();
    const isDoctorCompleted = 
      cleanDocStatus === 'completed' || 
      cleanDocStatus.includes('completed');
    
    // Clean and analyze patient status  
    const cleanPatStatus = patStatus.trim().toLowerCase();
    const isPatientCompleted = 
      cleanPatStatus === 'completed' || 
      cleanPatStatus.includes('completed');

    console.log(`Appt ${index + 1}:`, {
      doctor: { raw: docStatus, clean: cleanDocStatus, isCompleted: isDoctorCompleted },
      patient: { raw: patStatus, clean: cleanPatStatus, isCompleted: isPatientCompleted }
    });

    // Count based on analysis
    if (isDoctorCompleted) {
      doctorCompleted++;
      console.log(`  ✅ Doctor: COUNTED AS COMPLETED`);
    } else {
      doctorNotCompleted++;
      console.log(`  ❌ Doctor: COUNTED AS NOT COMPLETED`);
    }

    if (isPatientCompleted) {
      patientCompleted++;
      console.log(`  ✅ Patient: COUNTED AS COMPLETED`);
    } else {
      patientNotCompleted++;
      console.log(`  ❌ Patient: COUNTED AS NOT COMPLETED`);
    }
  });

  console.log("📊 FINAL IMPROVED COUNTS:", {
    doctorCompleted,
    doctorNotCompleted, 
    patientCompleted,
    patientNotCompleted,
    totalAppointments: appointments.length
  });

  // Prepare data for charts
  const doctorPieData = [
    { name: "Completed", value: doctorCompleted },
    { name: "Not Completed", value: doctorNotCompleted }
  ].filter(item => item.value >= 0); // Include even if zero

  const patientPieData = [
    { name: "Completed", value: patientCompleted },
    { name: "Not Completed", value: patientNotCompleted }
  ].filter(item => item.value >= 0);

  // Weekly appointments data
  const appointmentsByDay = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  
  appointments.forEach(apt => {
    if (apt.date) {
      try {
        const date = new Date(apt.date);
        if (!isNaN(date.getTime())) {
          const dayName = daysOfWeek[date.getDay()];
          appointmentsByDay[dayName]++;
        }
      } catch (error) {
        console.log("Invalid date:", apt.date);
      }
    }
  });

  const lineData = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => ({
    day,
    appointments: appointmentsByDay[day] || 0,
  }));

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Admin Dashboard</h1>

      {/* Data Status */}
      <div style={{ 
        background: '#f0f8ff', 
        padding: '15px', 
        marginBottom: '20px', 
        borderRadius: '8px',
        border: '2px solid #0088FE',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Data Overview</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
          <span><strong>Patients:</strong> {Object.keys(patients).length}</span>
          <span><strong>Doctors:</strong> {Object.keys(doctors).length}</span>
          <span><strong>Appointments:</strong> {appointments.length}</span>
          <span><strong>Doctor Completed:</strong> {doctorCompleted}</span>
          <span><strong>Patient Completed:</strong> {patientCompleted}</span>
        </div>
      </div>

      {/* Verification Summary */}
      <section style={{ display: "flex", justifyContent: "space-around", marginBottom: 50, flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h3>👨‍⚕️ Doctors</h3>
          <p>Total: {doctorStats.total}</p>
          <p style={{ color: "green", fontWeight: 'bold' }}>Verified: {doctorStats.verified}</p>
          <p style={{ color: "red", fontWeight: 'bold' }}>Unverified: {doctorStats.unverified}</p>
        </div>
        <div style={cardStyle}>
          <h3>🧑‍🤝‍🧑 Patients</h3>
          <p>Total: {patientStats.total}</p>
          <p style={{ color: "green", fontWeight: 'bold' }}>Verified: {patientStats.verified}</p>
          <p style={{ color: "red", fontWeight: 'bold' }}>Unverified: {patientStats.unverified}</p>
        </div>
      </section>

      {/* Completed / Not Completed Pie Charts */}
      <section style={{ display: "flex", justifyContent: "space-around", marginBottom: 50, flexWrap: 'wrap' }}>
        {/* Doctor Status Chart */}
        <div style={{ width: 400, height: 400, margin: '10px' }}>
          <h3 style={{ textAlign: "center", marginBottom: 15 }}>Doctor Status</h3>
          <div style={{ 
            textAlign: "center", 
            marginBottom: 15, 
            padding: '15px', 
            background: '#f9f9f9', 
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <p style={{ color: 'green', margin: '8px 0', fontSize: '18px', fontWeight: 'bold' }}>
              ✅ Completed: {doctorCompleted}
            </p>
            <p style={{ color: 'red', margin: '8px 0', fontSize: '18px', fontWeight: 'bold' }}>
              ❌ Not Completed: {doctorNotCompleted}
            </p>
            <p style={{ color: 'blue', margin: '8px 0', fontSize: '14px' }}>
              Total Appointments: {appointments.length}
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={doctorPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {doctorPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Patient Status Chart */}
        <div style={{ width: 400, height: 400, margin: '10px' }}>
          <h3 style={{ textAlign: "center", marginBottom: 15 }}>Patient Status</h3>
          <div style={{ 
            textAlign: "center", 
            marginBottom: 15, 
            padding: '15px', 
            background: '#f9f9f9', 
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}>
            <p style={{ color: 'green', margin: '8px 0', fontSize: '18px', fontWeight: 'bold' }}>
              ✅ Completed: {patientCompleted}
            </p>
            <p style={{ color: 'red', margin: '8px 0', fontSize: '18px', fontWeight: 'bold' }}>
              ❌ Not Completed: {patientNotCompleted}
            </p>
            <p style={{ color: 'blue', margin: '8px 0', fontSize: '14px' }}>
              Total Appointments: {appointments.length}
            </p>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={patientPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value, percent }) => 
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {patientPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} appointments`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Weekly Appointments Line Chart */}
      <section style={{ marginBottom: 50 }}>
        <h3 style={{ marginBottom: 20, textAlign: 'center' }}>Weekly Appointments Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="appointments" 
              stroke="#0088FE" 
              strokeWidth={3}
              name="Appointments"
              dot={{ fill: '#0088FE', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 20,
  width: 250,
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  textAlign: "center",
  background: "#fff",
  margin: "10px"
};