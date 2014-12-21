/**

GDevelop - Tile Map Extension
Copyright (c) 2014 Victor Levasseur (victorlevasseur52@gmail.com)
This project is released under the MIT License.
*/

#ifndef TILEMAPOBJECT_H
#define TILEMAPOBJECT_H
#include "GDCpp/Object.h"
#include "GDCpp/RuntimeObject.h"
#include "GDCpp/Polygon2d.h"
#include <boost/shared_ptr.hpp>
#include <SFML/Graphics/VertexArray.hpp>

#include "TileMapProxies.h"

class SFMLTextureWrapper;
class RuntimeScene;
namespace gd { class ImageManager; }
namespace gd { class InitialInstance; }
#if defined(GD_IDE_ONLY)
namespace gd { class Project; }
namespace gd { class MainFrameWrapper; }
class wxBitmap;
class wxWindow;
#endif

/**
 * TileMap Object
 */
class GD_EXTENSION_API TileMapObject : public gd::Object
{
public :

    TileMapObject(std::string name_);
    virtual ~TileMapObject() {};
    virtual gd::Object * Clone() const { return new TileMapObject(*this);}

    #if defined(GD_IDE_ONLY)
    virtual bool GenerateThumbnail(const gd::Project & project, wxBitmap & thumbnail) const;
    virtual void ExposeResources(gd::ArbitraryResourceWorker & worker);

    virtual void EditObject( wxWindow* parent, gd::Project & game_, gd::MainFrameWrapper & mainFrameWrapper_ );
    virtual void LoadResources(gd::Project & project, gd::Layout & layout);
    virtual void DrawInitialInstance(gd::InitialInstance & instance, sf::RenderTarget & renderTarget, gd::Project & project, gd::Layout & layout);
    virtual sf::Vector2f GetInitialInstanceDefaultSize(gd::InitialInstance & instance, gd::Project & project, gd::Layout & layout) const;
    #endif

    virtual float GetWidth() const;
    virtual float GetHeight() const;

    virtual void SetWidth(float newWidth) {};
    virtual void SetHeight(float newHeight) {};

    TileSetProxy tileSet;
    TileMapProxy tileMap;
    std::string textureName;

private:

    virtual void DoUnserializeFrom(gd::Project & project, const gd::SerializerElement & element);
    #if defined(GD_IDE_ONLY)
    virtual void DoSerializeTo(gd::SerializerElement & element) const;
    #endif

    sf::VertexArray vertexArray;
};

void DestroyTileMapObject(gd::Object * object);
gd::Object * CreateTileMapObject(std::string name);

#endif // TILEDSPRITEOBJECT_H