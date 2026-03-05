import { motion } from 'framer-motion';

export const SkeletonCard = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
    <div className="flex items-start justify-between mb-4">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-12 h-12 bg-slate-700/50 rounded-xl"
      />
    </div>
    <div className="space-y-3">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
        className="h-4 bg-slate-700/50 rounded w-1/2"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        className="h-8 bg-slate-700/50 rounded w-3/4"
      />
    </div>
  </div>
);

export const SkeletonHealth = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-6">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-6 bg-slate-700/50 rounded w-1/3"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-6 w-12 bg-slate-700/50 rounded"
      />
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
          className="h-16 bg-slate-700/50 rounded-xl"
        />
      ))}
    </div>
  </div>
);

export const SkeletonChart = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-6">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-6 bg-slate-700/50 rounded w-1/4"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-6 w-20 bg-slate-700/50 rounded"
      />
    </div>
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="h-64 bg-slate-700/50 rounded-xl"
    />
  </div>
);

export const SkeletonSlider = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="h-6 bg-slate-700/50 rounded w-1/3 mb-6"
    />
    <div className="space-y-6">
      <div className="flex justify-between">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-10 bg-slate-700/50 rounded w-1/3"
        />
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-10 bg-slate-700/50 rounded w-1/3"
        />
      </div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-3 bg-slate-700/50 rounded-full"
      />
    </div>
  </div>
);

export const SkeletonGauge = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-6">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-6 bg-slate-700/50 rounded w-1/3"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-6 w-16 bg-slate-700/50 rounded"
      />
    </div>
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-48 h-24 bg-slate-700/50 rounded-t-full"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="h-12 bg-slate-700/50 rounded w-1/2 mt-6"
      />
    </div>
  </div>
);
