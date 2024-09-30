import { Mesh, BufferGeometry, Vector3, BufferAttribute, MeshBasicMaterial, DoubleSide } from 'three';

export class DebugHelper
{
    public static createMesh(mesh: [x: number, y: number, z: number][][]): Mesh
    {
        const geometry = new BufferGeometry();
        const vertices = this.fixVerticies(mesh);
        const material = new MeshBasicMaterial({
            color: 0x00ff00,       // Green color for walkable surfaces
            transparent: true,
            opacity: 0.5,          // Semi-transparent
            side: DoubleSide, // Render both sides of the surface
            wireframe: true         // Enable wireframe mode for debugging
        });

        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();

        return new Mesh(geometry, material);
    }

    private static fixVerticies(mesh: [x: number, y: number, z: number][][]): Float32Array
    {
        const vertices = new Float32Array(mesh.length * 9);

        let vertexIndex = 0;
        mesh.forEach(surface =>
        {
            let verticesArray = [
                surface[0][0], surface[0][1], surface[0][2],  // First vertex
                surface[1][0], surface[1][1], surface[1][2],  // Second vertex
                surface[2][0], surface[2][1], surface[2][2]   // Third vertex
            ];

            // Ensure all triangles have consistent winding
            verticesArray = this.ensureClockwise(verticesArray);

            // Add each triangle's vertices to the vertices array
            vertices[vertexIndex++] = verticesArray[0];
            vertices[vertexIndex++] = verticesArray[1];
            vertices[vertexIndex++] = verticesArray[2];
            vertices[vertexIndex++] = verticesArray[3];
            vertices[vertexIndex++] = verticesArray[4];
            vertices[vertexIndex++] = verticesArray[5];
            vertices[vertexIndex++] = verticesArray[6];
            vertices[vertexIndex++] = verticesArray[7];
            vertices[vertexIndex++] = verticesArray[8];
        });

        return vertices;
    }

    private static ensureClockwise(vertices: number[]): number[]
    {
        const v1 = new Vector3(vertices[0], vertices[1], vertices[2]);
        const v2 = new Vector3(vertices[3], vertices[4], vertices[5]);
        const v3 = new Vector3(vertices[6], vertices[7], vertices[8]);

        const edge1 = new Vector3().subVectors(v2, v1);
        const edge2 = new Vector3().subVectors(v3, v1);

        const normal = new Vector3().crossVectors(edge1, edge2).normalize();

        if (normal.y < 0)
        {
            return [
                vertices[6], vertices[7], vertices[8],
                vertices[3], vertices[4], vertices[5],
                vertices[0], vertices[1], vertices[2]
            ];
        }

        return vertices;
    }
}