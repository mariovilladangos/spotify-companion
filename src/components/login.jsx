import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
    const { data: session, status } = useSession();

    if (status === "loading") return <p>Cargando...</p>;

    if (!session) {
        return (
            <div>
                <h1>No estás logueado</h1>
                <button onClick={() => signIn("spotify")}>Login con Spotify</button>
            </div>
        );
    }

    const accessToken = session.accessToken;

    return (
        <div>
            <h1>¡Hola, {session.user?.name}!</h1>
            <p>Logueado con Spotify correctamente</p>

            <button onClick={() => signOut()}>Logout</button>

            <pre>Access Token: {accessToken}</pre>
        </div>
    );
}
