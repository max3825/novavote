import { useCallback } from "react";

// Placeholder hook to encapsulate future client-side crypto (WebCrypto, WASM, etc.).
export function useEncryptionPlaceholder() {
  const encryptBallot = useCallback(async (payload: unknown) => {
    // TODO: replace with real crypto (ElGamal/BLS + ZKP generation)
    await new Promise((resolve) => setTimeout(resolve, 150));
    return {
      ciphertext: JSON.stringify(payload),
      proof: "proof-placeholder",
      trackingCode: crypto.randomUUID().slice(0, 8).toUpperCase(),
    };
  }, []);

  const verifyBallot = useCallback(async (trackingCode: string) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return { trackingCode, verified: true };
  }, []);

  return { encryptBallot, verifyBallot };
}
