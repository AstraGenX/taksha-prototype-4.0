const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  const healthCheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Taksha Veda API',
    version: '1.0.0'
  };
  
  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    healthCheck.message = 'Error';
    res.status(503).json(healthCheck);
  }
});

// Database health check
app.get('/api/health/db', (req, res) => {
  const dbStatus = {
    database: 'MongoDB',
    status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState,
    timestamp: new Date().toISOString()
  };
  
  if (mongoose.connection.readyState === 1) {
    res.status(200).json(dbStatus);
  } else {
    res.status(503).json(dbStatus);
  }
});

// Detailed health check
app.get('/api/health/detailed', (req, res) => {
  const memoryUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  const healthCheck = {
    service: 'Taksha Veda API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      readyState: mongoose.connection.readyState
    },
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)} MB`
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    process: {
      pid: process.pid,
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version
    }
  };
  
  res.status(200).json(healthCheck);
});

module.exports = app;