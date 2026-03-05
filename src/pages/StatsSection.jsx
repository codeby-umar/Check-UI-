import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, onSnapshot, query } from 'firebase/firestore';
import { motion, animate } from 'framer-motion';

t
const Counter = ({ value, suffix = "+" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (typeof value === 'string') {
      setDisplayValue(value);
      return;
    }

    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue}{typeof value === 'number' ? suffix : ''}</span>;
};

const StatsSection = () => {
  const [counts, setCounts] = useState({
    users: 0,
    tests: 0,
    success: 98, 
    support: "24/7"
  });

  useEffect(() => {
    const qUsers = query(collection(db, "users")); 
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      setCounts(prev => ({ ...prev, users: snapshot.size }));
    });

    const qTests = query(collection(db, "tests")); 
    const unsubTests = onSnapshot(qTests, (snapshot) => {
      setCounts(prev => ({ ...prev, tests: snapshot.size }));
    });

    return () => {
      unsubUsers();
      unsubTests();
    };
  }, []);

  const statItems = [
    { val: counts.users, label: "Foydalanuvchilar", suffix: "+" },
    { val: counts.tests, label: "Mavjud Testlar", suffix: "+" },
    { val: counts.success, label: "Muvaffaqiyat", suffix: "%" },
    { val: counts.support, label: "Qo'llab-quvvatlash", suffix: "" },
  ];

  return (
    <section className="py-20 border-y border-white/5 bg-white/2 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {statItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <h4 className="text-4xl md:text-5xl font-black text-white group-hover:text-[#B23DEB] transition-colors duration-300">
                <Counter value={item.val} suffix={item.suffix} />
              </h4>
              <p className="text-gray-500 uppercase tracking-widest text-[10px] md:text-xs mt-4">
                {item.label}
              </p>
              <div className="w-8 h-1 bg-[#B23DEB]/20 mx-auto mt-4 rounded-full group-hover:w-16 group-hover:bg-[#B23DEB] transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;