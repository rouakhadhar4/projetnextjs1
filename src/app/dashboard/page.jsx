'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiEdit, FiTrash, FiUserPlus } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Vérifie si le code s'exécute côté client
    if (typeof window !== 'undefined') {
      const loggedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Logged User:', loggedUser); // Débogage
      if (!loggedUser) {
        // Redirection si aucun utilisateur connecté
        router.push('/signin');
      } else {
        // Définit l'utilisateur connecté
        setUser(loggedUser);
      }

      // Récupère les profils depuis le localStorage
      const storedProfiles = JSON.parse(localStorage.getItem('profiles')) || [];
      setProfiles(storedProfiles);
    }
  }, [router]);

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/signin');
  };

  // Supprimer un profil
  const handleDelete = (email) => {
    const updatedProfiles = profiles.filter((profile) => profile.email !== email);
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
  };

  // Modifier un profil
  const handleEdit = (email) => {
    router.push(`/edit-profile?email=${email}`);
  };

  if (!user) {
    return null; // Empêche l'affichage si aucun utilisateur n'est connecté
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.email}</span>
            <button
              onClick={handleLogout}
              className="flex items-center bg-gray-800 px-3 py-2 rounded-md hover:bg-gray-700 transition"
            >
              <HiOutlineLogout className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto p-6 flex flex-col space-y-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Total Profiles</h2>
            <p className="text-3xl font-bold text-blue-600">{profiles.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Active Profiles</h2>
            <p className="text-3xl font-bold text-green-600">
              {profiles.filter((profile) => profile.status === 'Active').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">Inactive Profiles</h2>
            <p className="text-3xl font-bold text-red-600">
              {profiles.filter((profile) => profile.status === 'Inactive').length}
            </p>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Profiles</h2>
            <Link href="/add-profile">
              <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
                <FiUserPlus className="mr-2" /> Add Profile
              </button>
            </Link>
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 py-3 px-4">Name</th>
                <th className="border border-gray-300 py-3 px-4">Email</th>
                <th className="border border-gray-300 py-3 px-4">Role</th>
                <th className="border border-gray-300 py-3 px-4">Status</th>
                <th className="border border-gray-300 py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 px-4 text-center text-gray-500">
                    No profiles found.
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.email} className="border-t hover:bg-gray-100 transition">
                    <td className="border border-gray-300 py-3 px-4">{profile.name}</td>
                    <td className="border border-gray-300 py-3 px-4">{profile.email}</td>
                    <td className="border border-gray-300 py-3 px-4">{profile.role}</td>
                    <td className="border border-gray-300 py-3 px-4">{profile.status}</td>
                    <td className="border border-gray-300 py-3 px-4 text-center space-x-2">
                      <button
                        onClick={() => handleEdit(profile.email)}
                        className="text-blue-500 hover:underline flex items-center"
                      >
                        <FiEdit className="mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(profile.email)}
                        className="text-red-500 hover:underline flex items-center"
                      >
                        <FiTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
