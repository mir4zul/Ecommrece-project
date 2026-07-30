<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    public function addToWishlist(Request $request)
    {
        if (! Auth::check()) {
            return to_route('login')->with('error', 'Please login to manage your wishlist.');
        }

        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);
        $wishlist = Wishlist::query()
            ->where('user_id', Auth::id())
            ->where('product_id', $data['product_id'])
            ->first();

        if ($wishlist) {
            $wishlist->delete();

            return back()->with('success', 'Product removed from wishlist.');
        }

        $product = Product::query()->findOrFail($data['product_id']);
        Wishlist::query()->create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'name' => $product->name,
            'image' => $product->image,
            'price' => $product->price,
        ]);

        return back()->with('success', 'Product added to wishlist.');
    }

    public function removeFromWishlist(Wishlist $wishlist)
    {
        abort_unless($wishlist->user_id === Auth::id(), 403);
        $wishlist->delete();

        return back()->with('success', 'Product removed from wishlist.');
    }
}
