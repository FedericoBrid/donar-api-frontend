
interface PlaceholderPageProps {
    title: string;
}

function PlaceholderPage({title}: PlaceholderPageProps){
    return (
        <section>
            <h1>{title}</h1>
            <p>This is a placeholder page.</p>
        </section>
    );  
}

export default PlaceholderPage;