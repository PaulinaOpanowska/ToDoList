using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using ToDoBackend.Controllers.Resources;

namespace ToDoBackend.Core
{
    public class UserService : IUserService
    {
        private const int SALT_BYTES = 24;
        private const int HASH_BYTES = 64;
        private const int PBKDF2_ITERATIONS = 128000;

        private const string LOGIN = "test";
        private const string PASSWORD = "bYpRkl8S1Gcch1gT2iIy9L9g85+7Z2JAvwTLtnAHC0pbRHmbR9Y9sGnh+uIcsM0sk7XJnPxnrjwyDcaQCVf66Q==";
        private const string SALT = "YFZMbFEfi+LrFXsx4S61nJOyMnXUSCem";

        public bool CheckPassword(LoginResource login)
        {
            if(login.Login != LOGIN)
                throw new Exception("Nie znaleziono użytkownika o podanym loginie");

            int iterations = 0;
            try
            {
                iterations = PBKDF2_ITERATIONS;
            }
            catch (ArgumentNullException ex)
            {
                throw new Exception(
                    "Invalid argument given to Int32.Parse",
                    ex
                );
            }
            catch (FormatException ex)
            {
                throw new Exception(
                    "Could not parse the iteration count as an integer.",
                    ex
                );
            }
            catch (OverflowException ex)
            {
                throw new Exception(
                    "The iteration count is too large to be represented.",
                    ex
                );
            }

            if (iterations < 1)
            {
                throw new Exception(
                    "Invalid number of iterations. Must be >= 1."
                );
            }

            byte[] hash = null;
            try
            { 
                hash = Convert.FromBase64String(PASSWORD);
            }
            catch (ArgumentNullException ex)
            {
                throw new Exception(
                    "Invalid argument given to Convert.FromBase64String",
                    ex
                );
            }
            catch (FormatException ex)
            {
                throw new Exception(
                    "Base64 decoding of pbkdf2 output failed.",
                    ex
                );
            }

            int storedHashSize = 0;
            try
            {
                storedHashSize = HASH_BYTES;
            }
            catch (ArgumentNullException ex)
            {
                throw new Exception(
                    "Invalid argument given to Int32.Parse",
                    ex
                );
            }
            catch (FormatException ex)
            {
                throw new Exception(
                    "Could not parse the hash size as an integer.",
                    ex
                );
            }
            catch (OverflowException ex)
            {
                throw new Exception(
                    "The hash size is too large to be represented.",
                    ex
                );
            }

            if (storedHashSize != hash.Length)
            {
                throw new Exception(
                    "Hash length doesn't match stored hash length."
                );
            }

            byte[] testHash = PBKDF2(login.Haslo, Convert.FromBase64String(SALT), iterations, hash.Length);
            return SlowEquals(hash, testHash);

        }

        private static bool SlowEquals(byte[] a, byte[] b)
        {
            uint diff = (uint)a.Length ^ (uint)b.Length;
            for (int i = 0; i < a.Length && i < b.Length; i++)
            {
                diff |= (uint)(a[i] ^ b[i]);
            }
            return diff == 0;
        }

        private static byte[] PBKDF2(string password, byte[] salt, int iterations, int outputBytes)
        {
            using (Rfc2898DeriveBytes pbkdf2 = new Rfc2898DeriveBytes(password, salt))
            {
                pbkdf2.IterationCount = iterations;
                return pbkdf2.GetBytes(outputBytes);
            }
        }
    }
}
