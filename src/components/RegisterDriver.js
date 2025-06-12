import React, { useState } from "react";
import { auth, db } from "./firebase/firebaseData.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import styles from "./css/register.module.css";

export default function RegisterDriver() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("A registrar...");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "drivers", user.uid), {
        nome,
        email,
        createdAt: new Date(),
      });

      setStatus("Motorista registado com sucesso!");
      setNome("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setStatus("Erro ao registrar: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleRegister} className={styles.form}>
        <h2 className={styles.heading}>Registrar Motorista</h2>

        <label className={styles.label} htmlFor="nome">
          Nome:
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label} htmlFor="email">
          Email:
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </label>

        <label className={styles.label} htmlFor="password">
          Password:
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={styles.input}
          />
        </label>

        <button type="submit" className={styles.button}>
          Registrar
        </button>

        <p className={styles.status}>{status}</p>
      </form>
    </div>
  );
}
